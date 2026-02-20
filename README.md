# KS<span style="color: red">e</span>F PDF Generator

<a href="https://github.com/sstybel/ksef-pdf-generator/releases/latest"><img alt="Static Badge" src="https://img.shields.io/badge/download-red?style=for-the-badge&label=stable&color=%23FF0000&link=https%3A%2F%2Fgithub.com%2Fsstybel%2Fksef-pdf-generator%2Freleases%2Flatest"></a> ![GitHub Release](https://img.shields.io/github/v/release/sstybel/ksef-pdf-generator?sort=date&display_name=release&style=for-the-badge&logo=github&label=release&link=https%3A%2F%2Fgithub.com%2Fsstybel%2Fksef-pdf-generator) ![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/sstybel/ksef-pdf-generator/total?style=for-the-badge&logo=github&link=https%3A%2F%2Fgithub.com%2Fsstybel%2Fksef-pdf-generator)

A tool for generating visualizations of invoices in **PDF** format based on **XML** invoice files downloaded from the National e-Invoice System ([**KS<span style="color: red">e</span>F** - **K**rajowy **S**ystem **<span style="color: red">e</span>-F**aktur](https://ksef.podatki.gov.pl/)) - https://ksef.podatki.gov.pl/.

The repository of this tool is based on a fork originating from:
1. https://github.com/CIRFMF/ksef-pdf-generator ([**@CIRF**](https://github.com/CIRFMF))
2. https://github.com/aiv/ksef-pdf-generator ([**@aiv (Mariusz Dalewski**](https://github.com/aiv))

This application only creates visualizations of **KSeF invoices** in **XML** format downloaded from the **National e-Invoice System** (e.g., using the tool [**KSeF XML Downloader**](https://github.com/sstybel/ksef-xml-download)). The generated invoices contain a **QR code** that can be used to check whether your invoice is in the **KSeF** system.

Starting with version [**1.1.0 releases**](https://github.com/sstybel/ksef-pdf-generator/releases/tag/1.1.0), it is now possible to convert KSeF **XML** invoices to **PDF** files based on the status of downloaded KSeF **XML** invoices using the [**KSeF XML Downloader**](https://github.com/sstybel/ksef-xml-download) tool . The [**KSeF XML Downloader**](https://github.com/sstybel/ksef-xml-download) tool saves the result of its operation, among other things, to a **JSON** file, which contains, among other things, the location of invoices in KSeF **XML** format. This file (**JSON**) can now be used as a source to indicate the location of **KSeF XML** invoice files.

![Example Screen-Shot ](https://github.com/sstybel/ksef-pdf-generator/blob/main/images/screen01.png)

&nbsp;

![Example Screen-Shot ](https://github.com/sstybel/ksef-pdf-generator/blob/main/images/screen02.png)

> Click to see a sample [**PDF**](https://github.com/sstybel/ksef-pdf-generator/blob/main/examples/invoice.pdf) invoice generated based on the [**KSeF XML**](https://github.com/sstybel/ksef-pdf-generator/blob/main/examples/invoice.xml) file.

## Syntax of the `ksef-pdf-generator.exe`

**Usage:** `ksef-pdf-generator.exe` `<ksef-xml-file>` [`options`]

**Options:**
* [`-s`], [`-state`] [`X:\path\output-json.json`] - Convert KSeF XML invoices to **PDFs** based on the state of the downloaded KSeF **XML** invoices by the tool [**KSeF XML Downloader**](https://github.com/sstybel/ksef-xml-download)
* [`-o`], [`--output`] [`<ksef-pdf-file>`] - Path to the output **PDF** file (default: **XML** file name changed to **.pdf**)
* `-h`, `--help` - Display this help message

**Notes:**
* The **KSeF number** is automatically detected from the **XML** file name. Format: `<nip>-<date>-<hash>-<codec_crc>.xml` (e.g., `0101010101-20260201-1A2B3C456D7E-F8.xml`)
* If the **KSeF number** is not found, the value **“NONE”** is used.
* The **QR code** is generated based on the **KSeF number**. If the **KSeF number** is not found, the **KSeF** value will be used as **“NONE”** and the **QR code** will use **“`0101010101-20260201-1A2B3C456D7E-F8`”** (**KSeF number**) as the default value for generating the **QR code**.
* If you use the [**KSeF XML Downloader**](https://github.com/sstybel/ksef-xml-download) to generate invoices based on the status of downloaded invoices, the **PDF** invoice visualizations will be saved in the same location as the **KSeF XML** invoice files. The invoice name will be the same as the **KSeF XML** invoice file, with the extension changed from **XML** to **PDF**.

## Examples

<br>

```sh 
ksef-pdf-generator.exe 0101010101-20260201-1A2B3C456D7E-F8.xml
```

> <br> Output file: `.\0101010101-20260201-1A2B3C456D7E-F8.pdf`
>
> &nbsp;

```sh 
ksef-pdf-generator.exe .\assets\invoice.xml -o output.pdf
```

> <br> Output file: `.\output.pdf`
> 
> &nbsp;

```sh 
ksef-pdf-generator.exe -s d:\\_ksef_\\ksef_invoices-output-json_20260217112540.json
```

> <br> Output file(s): 
> 
> `d:\\_ksef_\\0101010101-20260201-1A2B3C456D7A-F8.pdf`
> `d:\\_ksef_\\2020202020-20260202-1A2B3C456D7B-C9.pdf`
> 
> `...`
> 
> `d:\\_ksef_\\1919191919-20260209-1A2B3C456D7C-5A.pdf`
> 
> &nbsp;
&nbsp;

![Example Screen-Shot ](https://github.com/sstybel/ksef-pdf-generator/blob/main/images/screen01.png)

&nbsp;

![Example Screen-Shot ](https://github.com/sstybel/ksef-pdf-generator/blob/main/images/screen02.png)

> Click to see a sample [**PDF**](https://github.com/sstybel/ksef-pdf-generator/blob/main/examples/invoice.pdf) invoice generated based on the [**KSeF XML**](https://github.com/sstybel/ksef-pdf-generator/blob/main/examples/invoice.xml) file.

## Download

<a href="https://github.com/sstybel/ksef-pdf-generator/releases/latest"><img alt="Static Badge" src="https://img.shields.io/badge/download-red?style=for-the-badge&label=stable&color=%23FF0000&link=https%3A%2F%2Fgithub.com%2Fsstybel%2Fksef-pdf-generator%2Freleases%2Flatest"></a> ![GitHub Release](https://img.shields.io/github/v/release/sstybel/ksef-pdf-generator?sort=date&display_name=release&style=for-the-badge&logo=github&label=release&link=https%3A%2F%2Fgithub.com%2Fsstybel%2Fksef-pdf-generator) ![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/sstybel/ksef-pdf-generator/total?style=for-the-badge&logo=github&link=https%3A%2F%2Fgithub.com%2Fsstybel%2Fksef-pdf-generator)

##  GitHub

![GitHub stats](https://github-readme-stats-sigma-five.vercel.app/api?username=sstybel&show_icons=true&theme=react&hide_title=true&include_all_commits=true)

&nbsp;

---

## Copyright &copy; 2025 - 2026 by Sebastian Stybel, [www.BONO-IT.pl](https://www.bono-it.pl/)
