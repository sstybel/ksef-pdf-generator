#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { xml2js } from 'xml-js';
import { generateFA1 } from './lib-public/FA1-generator';
import { generateFA2 } from './lib-public/FA2-generator';
import { generateFA3 } from './lib-public/FA3-generator';
import { Faktura as Faktura1 } from './lib-public/types/fa1.types';
import { Faktura as Faktura2 } from './lib-public/types/fa2.types';
import { Faktura as Faktura3 } from './lib-public/types/fa3.types';
import { AdditionalDataTypes } from './lib-public/types/common.types';
import Base64url from "crypto-js/enc-base64url"
import SHA256 from "crypto-js/sha256";

function extractNrKSeFFromFilename(filename: string): string | null {
  const ksefPattern = /(\d{10}-\d{8}-[A-Z0-9]{12,16}-[A-Z0-9]{2})/i;
  const match = filename.match(ksefPattern);
  return match ? match[1] : null;
}

function extractNIPFromKSeF(nrKSeF: string): string | null {
  const match = nrKSeF.substring(0, 10);
  return match;
}

function extractDateFromKSeF(nrKSeF: string): string | null {
  const datestr = nrKSeF.substring(11, 19);
  const dd = nrKSeF.substring(17, 19);
  const mm = nrKSeF.substring(15, 17);
  const yy = nrKSeF.substring(11, 15);
  const match = dd + '-' + mm + '-' + yy;
  return match;
}

function stripPrefixes<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(stripPrefixes) as T;
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]: [string, T]): [string, T] => [
        key.includes(':') ? key.split(':')[1] : key,
        stripPrefixes(value),
      ])
    ) as T;
  }
  return obj;
}

function parseXMLFromFile(filePath: string): unknown {
  const xmlStr = readFileSync(filePath, 'utf-8');
  const jsonDoc = stripPrefixes(xml2js(xmlStr, { compact: true }));
  return jsonDoc;
}

async function main() {
  const args = process.argv.slice(2);

      console.log(`
KSeF PDF Generator - ver. 1.0.0
Copyright (c) 2025 - 2026 by Sebastian Stybel, www.BONO.Edu.PL
------------------------------------------------------------------------------
`);
    
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`Useage: ksef-pdf-generator.exe [options] <ksef-xml-file>

A tool for generating PDF documents from KSeF XML files.

Options:
  [-o], [--output] [<ksef-pdf-file>]     Path to output PDF file (default: like name XML file with changed extension to .pdf)
  -h, --help                       Show this help message

Attention:
  - Number of KSeF is automatically detected from the XML filename
    Format: <nip>-<date>-<hash>-<crc_code>.xml (e.g. 0101010101-20260201-1A2B3C456D7E-F8.xml)
  - If the number of KSeF is not found, the value "NONE" is used
  - QR code is generated based on the KSeF number and if number of KSeF is not found,
    the value of KSeF used "NONE" value and QR code use value "0101010101-20260201-1A2B3C456D7E-F8"
    of KSeF number as default values to generate QR code

Example:
  ksef-pdf-generator.exe 0101010101-20260201-1A2B3C456D7E-F8.xml
  ksef-pdf-generator.exe assets/invoice.xml -o output.pdf
`);
    process.exit(0);
  }

  let inputFile = '';
  let outputFile = '';
  let is_o = true;
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '-o' || arg === '--output') {
      outputFile = args[++i];
	  is_o = false;
    } else if (!arg.startsWith('-')) {
      inputFile = arg;
    }
  }

  if (!inputFile) {
    console.error('❌ Error: You must provide an input XML file');
    console.error('Use --help to see usage instructions');
    process.exit(1);
  }
  
  if (is_o) {
    outputFile = inputFile.substring(0, inputFile.length - 4) + '.pdf';
  }

  const detectedNrKSeF = extractNrKSeFFromFilename(inputFile);
  const nrKSeF = detectedNrKSeF || 'NONE';
  let nrNIP = extractNIPFromKSeF(nrKSeF);
  let dataInvoice = extractDateFromKSeF(nrKSeF);

  if (detectedNrKSeF) {
    console.log(`🔍 Finding KSeF number from filename: ${nrKSeF}`);
  } else {
    console.log(`ℹ️  No KSeF number detected in filename, using: "NONE"`);
    nrNIP = '0101010101';
    dataInvoice = '01-02-2026';
  }

  try {
    console.log(`📄 Parsing XML: ${inputFile}`);
    const xml: unknown = parseXMLFromFile(resolve(inputFile));
	
	const xmlfile = readFileSync(inputFile, 'utf-8');
	const xmlhash = SHA256(xmlfile);
	const xmlhashb64 = Base64url.stringify(xmlhash);
  const qrCode = 'https://qr.ksef.mf.gov.pl/invoice/' + nrNIP + '/' + dataInvoice + '/' + xmlhashb64
	
	console.log(`🔑 Hash SHA-256 file: ${xmlhash}`);
	console.log(`🔑 Hash SHA-256 file to Base64: ${xmlhashb64}`);
	console.log(`🔑 QR Code Link: ${qrCode}`);
	
    const wersja: any = (xml as any)?.Faktura?.Naglowek?.KodFormularza?._attributes?.kodSystemowy;

    if (!wersja) {
      console.error('❌ Error: Cannot determine invoice version (FA1/FA2/FA3)');
      process.exit(1);
    }

    console.log(`📋 Invoice version: ${wersja}`);

    const additionalData: AdditionalDataTypes = {
      nrKSeF,
	  qrCode,
    };

    console.log(`🔧 Generating PDF...`);

    return new Promise((resolvePromise, reject) => {
      let pdf;

      switch (wersja) {
        case 'FA (1)':
          pdf = generateFA1((xml as any).Faktura as Faktura1, additionalData);
          break;
        case 'FA (2)':
          pdf = generateFA2((xml as any).Faktura as Faktura2, additionalData);
          break;
        case 'FA (3)':
          pdf = generateFA3((xml as any).Faktura as Faktura3, additionalData);
          break;
        default:
          console.error(`❌ Unhandled invoice version: ${wersja}`);
          process.exit(1);
      }

      pdf.getBuffer((buffer: Buffer) => {
        try {
          writeFileSync(resolve(outputFile), buffer);
          console.log(`✅ PDF generated successfully: ${resolve(outputFile)}`);
          resolvePromise(null);
        } catch (error) {
          console.error('❌ Error while saving PDF:', error);
          reject(error);
        }
      });
    });

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
