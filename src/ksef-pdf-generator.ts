#!/usr/bin/env node
import { readFile, readFileSync, writeFile, writeFileSync } from 'fs';
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
import { a } from 'vitest/dist/chunks/suite.d.FvehnV49';
import { i } from 'vite/dist/node/chunks/moduleRunnerTransport';

interface ksefSeller {
  nip: string;
  name: string;
}
interface ksefBuyer {
  identifier: {
    type: string;
    value: string;
  };
  name: string;
}

interface ksefFormCode {
  systemCode: string;
  schemaVersion: string;
  value: string;
}

interface ksefSubject {
  ksefNumber: string;
  invoiceNumber: string;
  issueDate: string;
  invoicingDate: string;
  acquisitionDate: string;
  permanentStorageDate: string;
  seller: ksefSeller;
  buyer: ksefBuyer;
  netAmount: number
  grossAmount: number
  vatAmount: number
  currency: string;
  invoicingMode: string;
  invoiceType: string;
  formCode: ksefFormCode;
  isSelfInvoicing: boolean;
  hasAttachment: boolean;
  invoiceHash: string;
  qrCode: string;
  fileName: string;
}
interface ksefSubjects {
  subjects: ksefSubject[];
}

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
KSeF PDF Generator - ver. 1.1.0
Copyright (c) 2025 - 2026 by Sebastian Stybel, www.BONO.Edu.PL
------------------------------------------------------------------------------
`);
    
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`Useage: ksef-pdf-generator.exe <ksef-xml-file> [options]

A tool for generating PDF documents from KSeF XML files.

Options:
  [-s], [-state] [X:\\path\\output-json.json]   Convert KSeF XML invoices to PDFs based on the state of the downloaded KSeF XML invoices by the tool KSeF XML Invoices Downloader 
  [-o], [--output] [<ksef-pdf-file>]          Path to output PDF file (default: like name XML file with changed extension to .pdf)
  -h, --help                                  Show this help message

Attention:
  - Number of KSeF is automatically detected from the XML filename
    Format: <nip>-<date>-<hash>-<crc_code>.xml (e.g. 0101010101-20260201-1A2B3C456D7E-F8.xml)
  - If the number of KSeF is not found, the value "NONE" is used
  - QR code is generated based on the KSeF number and if number of KSeF is not found,
    the value of KSeF used "NONE" value and QR code use value "0101010101-20260201-1A2B3C456D7E-F8"
    of KSeF number as default values to generate QR code
  - If you use the KSeF XML Invoices Downloader to generate invoices based on the status of downloaded
    invoices, the PDF invoice visualizations will be saved in the same location as the KSeF XML invoice files.
    The invoice name will be the same as the KSeF XML invoice file, with the extension changed from XML to PDF.

Example:
  ksef-pdf-generator.exe 0101010101-20260201-1A2B3C456D7E-F8.xml
  ksef-pdf-generator.exe .\\assets\\invoice.xml -o output.pdf
  ksef-pdf-generator.exe -s d:\\_ksef_\\ksef_invoices-output-json_20260217112540.json
`);
    process.exit(0);
  }

  let inputFile = '';
  let outputFile = '';
  let stateFile: string = '';
  let is_i = false;
  let is_o = false;
  let is_s = false;
  let inputFiles = [];
  let pdf: pdfMake.TCreatedPdf;
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '-o' || arg === '--output') {
      outputFile = args[++i];
	    is_o = true;
    } else if (arg === '-s' || arg === '-state') {
      stateFile = args[++i];
      is_s = true;
    } else if (!arg.startsWith('-')) {
      inputFile = arg;
      is_i  = true;
    }
  }

  if (is_s || is_i) {
    if (!stateFile && is_s) {
      console.error('❌ Error: You must provide a state JSON file');
      console.error('Use --help to see usage instructions');
      process.exit(1);
    }
    if (is_s && is_i) {
      console.warn('⚠️  Warning: Input XML file is ignored when using state JSON file');
      is_i = false;
      inputFile = '';
    }
    if (is_s && is_o) {
      console.warn('⚠️  Warning: Output file option is ignored when using state JSON file.\n            PDF files will be saved with the same name as XML files with .pdf extension');
      is_o = false;
      outputFile = '';
    }
  }

  if (is_i) {
    console.log(`📖 Input file provided: ${inputFile}`);
  }

  if (is_o) {
    console.log(`🚪 Output file provided: ${outputFile}`);
  }

  if (is_s) {
    console.log(`🔍 State file provided: ${stateFile}`);
    console.log(`🔍 Processing state file: ${stateFile}`)

    let jsonState: string;
    
    try {
      jsonState = readFileSync(stateFile, 'utf-8');
    } catch (err) {
      console.error('❌ Error: Reading JSON state file:', err);
      process.exit(1);
    }

    let ksefData: ksefSubjects = JSON.parse(jsonState);

    for (const dataSubjects in ksefData) {
      const dataSubject = ksefData[dataSubjects as keyof ksefSubjects];
      for (const data of dataSubject) {
        const xmlFilePath = data.fileName;
        inputFiles.push(xmlFilePath);
        inputFile = '';
        console.log(`📄 Added XML file from state: ${xmlFilePath}`);
      }
    }
  } else {
    if (inputFiles.length === 0 && inputFile != '') {
      inputFiles.push(inputFile);
      inputFile = ''
    }
  }

  if (inputFiles.length === 0) {
    console.error('❌ Error: You must provide an input XML file or a state JSON file');
    console.error('Use --help to see usage instructions');
    process.exit(1);
  } else {
    for (inputFile of inputFiles) {
      if (!is_o) {
        outputFile = inputFile.substring(0, inputFile.length - 4) + '.pdf';
      }

      console.log(`🚪 Output file provided: ${outputFile}`);

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
        const xml: unknown = parseXMLFromFile(inputFile);
      
        const xmlfile = readFileSync(inputFile, 'utf-8');
        const xmlhash = SHA256(xmlfile);
        const xmlhashb64 = Base64url.stringify(xmlhash);
        const qrCode = 'https://qr.ksef.mf.gov.pl/invoice/' + nrNIP + '/' + dataInvoice + '/' + xmlhashb64
        
        console.log(`🔑 Hash SHA-256 file: ${xmlhash}`);
        console.log(`🔑 Hash SHA-256 file to Base64: ${xmlhashb64}`);
        console.log(`🔑 QR Code Link: ${qrCode}`);
      
        const ksefVersion: any = (xml as any)?.Faktura?.Naglowek?.KodFormularza?._attributes?.kodSystemowy;

        if (!ksefVersion) {
          console.error('❌ Error: Cannot determine invoice version (FA1/FA2/FA3)');
          process.exit(1);
        }

        console.log(`📋 Invoice version: ${ksefVersion}`);

        const additionalData: AdditionalDataTypes = {
          nrKSeF,
          qrCode,
        };

        console.log(`🔧 Generating PDF...`);

        const generateBuffer = (pdfDoc: any): Promise<Buffer> => {
          return new Promise((resolve, reject) => {
            try {
              pdfDoc.getBuffer((buffer: Buffer) => {
                resolve(buffer);
              });
            } catch (error) {
              reject(error);
            }
          });
        };      

        switch (ksefVersion) {
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
            console.error(`❌ Unhandled invoice version: ${ksefVersion}`);
            process.exit(1);
        }

        try {
          const buffer = await generateBuffer(pdf);
          writeFileSync(outputFile, buffer);
          console.log(`✅ PDF generated successfully: ${outputFile}`);
        } catch (error) {
          console.error('❌ Error while saving PDF:', error);
        }
      } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
      }
    }
  }
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
