#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
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
import { TCreatedPdf } from 'pdfmake/build/pdfmake';

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

let is_e = false;
let sh_e = "";
let is_q = false;

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
   
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
KSeF PDF Generator - ver. 1.3.0
Copyright (c) 2025 - 2026 by Sebastian Stybel, www.BONO-IT.pl
------------------------------------------------------------------------------
`);

    console.log(`Useage: ksef-pdf-generator.exe <ksef-xml-file> [options]

A tool for generating PDF documents from KSeF XML files.

Options:
  [-s], [--state] [X:\\path\\output-json.json]  Convert KSeF XML invoices to PDFs based on the state of the downloaded KSeF XML invoices by the tool KSeF XML Invoices Downloader 
  [-o], [--output] [<ksef-pdf-file>]          Path to output PDF file (default: like name XML file with changed extension to .pdf)
  [-e], [--emo]                               Show emoticons in on-screen messages
  [-q], [--quiet]                             Quiet mode, does not display messages on the screen
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
  let pdf: TCreatedPdf;
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '-o' || arg === '--output') {
      outputFile = args[++i];
	    is_o = true;
    } else if (arg === '-s' || arg === '--state') {
      stateFile = args[++i];
      is_s = true;
    } else if (arg === '-e' || arg === '--emo') {
      is_e = true;
    } else if (arg === '-q' || arg === '--quiet') {
      is_q = true;
    } else if (!arg.startsWith('-')) {
      inputFile = arg;
      is_i  = true;
    }
  }

  if (!is_q) console.log(`
KSeF PDF Generator - ver. 1.3.0
Copyright (c) 2025 - 2026 by Sebastian Stybel, www.BONO-IT.pl
------------------------------------------------------------------------------
`);

  if (is_s || is_i) {
    if (!stateFile && is_s) {
      if (is_e) { sh_e = '❌ '; }
      if (!is_q) console.error(sh_e + 'Error: You must provide a state JSON file');
      if (!is_q) console.error('Use --help to see usage instructions');
      process.exit(1);
    }
    if (is_s && is_i) {
      if (is_e) { sh_e = '⚠️  '; }
      if (!is_q) console.warn(sh_e + 'Warning: Input XML file is ignored when using state JSON file');
      is_i = false;
      inputFile = '';
    }
    if (is_s && is_o) {
      if (is_e) { sh_e = '⚠️  '; }
      if (!is_q) console.warn(sh_e + 'Warning: Output file option is ignored when using state JSON file.\n            PDF files will be saved with the same name as XML files with .pdf extension');
      is_o = false;
      outputFile = '';
    }
  }

  if (is_i) {
    if (is_e) { sh_e = '📖 '; }
    if (!is_q) console.log(`${sh_e}Input file provided: ${inputFile}`);
  }

  if (is_o) {
    if (is_e) { sh_e = '🚪 '; }
    if (!is_q) console.log(`${sh_e}Output file provided: ${outputFile}`);
  }

  if (is_s) {
    if (is_e) { sh_e = '🔍 '; }
    if (!is_q) console.log(`${sh_e}State file provided: ${stateFile}`);
    if (!is_q) console.log(`${sh_e}Processing state file: ${stateFile}`)

    let jsonState: string;
    
    try {
      jsonState = readFileSync(stateFile, 'utf-8');
    } catch (err) {
      if (is_e) { sh_e = '❌ '; }
      if (!is_q) console.error(sh_e + 'Error: Reading JSON state file:', err);
      process.exit(1);
    }

    let ksefData: ksefSubjects = JSON.parse(jsonState);

    for (const dataSubjects in ksefData) {
      const dataSubject = ksefData[dataSubjects as keyof ksefSubjects];
      for (const data of dataSubject) {
        const xmlFilePath = data.fileName;
        const xmlInvDate = data.invoicingDate;
        const xmlInvStor = data.permanentStorageDate;
        const dictCMLKSeF = {file: xmlFilePath, dateInv: xmlInvDate, dateInvStor: xmlInvStor};
        inputFiles.push(dictCMLKSeF);
        inputFile = '';
        if (is_e) { sh_e = '📄 '; }
        if (!is_q) console.log(`${sh_e}Added XML file from state: ${xmlFilePath}`);
      }
    }
  } else {
    if (inputFiles.length === 0 && inputFile != '') {
      inputFiles.push(inputFile);
      inputFile = ''
    }
  }

  if (inputFiles.length === 0) {
    if (is_e) { sh_e = '❌ '; }
    if (!is_q) console.error(sh_e + 'Error: You must provide an input XML file or a state JSON file');
    if (!is_q) console.error('Use --help to see usage instructions');
    process.exit(1);
  } else {
    let inputData: any;
    for (inputData of inputFiles) {
      let inputFile = inputData.file;
      let inputDateInv = Date.parse(inputData.dateInv);
      let inputDateInvStor =  Date.parse(inputData.dateInvStor);

      if (!is_o) {
        outputFile = inputFile.substring(0, inputFile.length - 4) + '.pdf';
      }

      if (is_e) { sh_e = '🚪 '; }
      if (!is_q) console.log(`${sh_e}Output file provided: ${outputFile}`);

      const detectedNrKSeF = extractNrKSeFFromFilename(inputFile);
      const nrKSeF = detectedNrKSeF || 'NONE';
      let nrNIP = extractNIPFromKSeF(nrKSeF);
      let dataInvoice = extractDateFromKSeF(nrKSeF);

      if (detectedNrKSeF) {
        if (is_e) { sh_e = '🔍 '; }
        if (!is_q) console.log(`${sh_e}Finding KSeF number from filename: ${nrKSeF}`);
      } else {
        if (is_e) { sh_e = 'ℹ️  '; }
        if (!is_q) console.log(`${sh_e}No KSeF number detected in filename, using: "NONE"`);
        nrNIP = '0101010101';
        dataInvoice = '01-02-2026';
      }

      try {
        if (is_e) { sh_e = '📄 '; }
        if (!is_q) console.log(`${sh_e}Parsing XML: ${inputFile}`);
        const xml: unknown = parseXMLFromFile(inputFile);
        const namefilexml = inputFile.split("\\").pop();
        const xmlfile = readFileSync(inputFile, 'utf-8');
        const xmlhash = SHA256(xmlfile);
        const xmlhashb64 = Base64url.stringify(xmlhash);
        const qrCode = 'https://qr.ksef.mf.gov.pl/invoice/' + nrNIP + '/' + dataInvoice + '/' + xmlhashb64
        
        let DataBase64XML = Buffer.from(xmlfile, 'binary').toString('base64');
        let DataUri = `data:application/xml;base64,${DataBase64XML}`;

        if (is_e) { sh_e = '🔑 '; }
        if (!is_q) console.log(`${sh_e}Hash SHA-256 file: ${xmlhash}`);
        if (!is_q) console.log(`${sh_e}Hash SHA-256 file to Base64: ${xmlhashb64}`);
        if (!is_q) console.log(`${sh_e}QR Code Link: ${qrCode}`);
      
        const ksefVersion: any = (xml as any)?.Faktura?.Naglowek?.KodFormularza?._attributes?.kodSystemowy;

        if (!ksefVersion) {
          if (is_e) { sh_e = '❌ '; }
          if (!is_q) console.error(sh_e + 'Error: Cannot determine invoice version (FA1/FA2/FA3)');
          process.exit(1);
        }

        if (is_e) { sh_e = '📋 '; }
        if (!is_q) console.log(`${sh_e}Invoice version: ${ksefVersion}`);

        const additionalData: AdditionalDataTypes = {
          nrKSeF,
          qrCode,
        };

        if (is_e) { sh_e = '🔧 '; }
        if (!is_q) console.log(`${sh_e}Generating PDF...`);

        switch (ksefVersion) {
          case 'FA (1)':
            pdf = generateFA1((xml as any).Faktura as Faktura1, additionalData);
            break;
          case 'FA (2)':
            pdf = generateFA2((xml as any).Faktura as Faktura2, additionalData);
            break;
          case 'FA (3)':
            pdf = generateFA3((xml as any).Faktura as Faktura3, additionalData, DataUri, namefilexml, inputDateInv, inputDateInvStor, 'Krajowy System e-Faktur - XML');
            break;
          default:
            if (is_e) { sh_e = '❌ '; }
            if (!is_q) console.error(`${sh_e}Unhandled invoice version: ${ksefVersion}`);
            process.exit(1);
        }

        try {
          let buffer = await pdf.getBuffer()
          writeFileSync(outputFile, buffer);
          if (is_e) { sh_e = '✅ '; }
          if (!is_q) console.log(`${sh_e}PDF generated successfully: ${outputFile}`);
        } catch (error) {
          if (is_e) { sh_e = '❌ '; }
          if (!is_q) console.error(sh_e + 'Error while saving PDF:', error);
        }
      } catch (error) {
        if (is_e) { sh_e = '❌ '; }
        if (!is_q) console.error(sh_e + 'Error:', error);
        process.exit(1);
      }
    }
  }
}

main().catch((error) => {
  if (is_e) { sh_e = '❌ '; }
  if (!is_q) console.error(sh_e+ 'Unexpected error:', error);
  process.exit(1);
});
