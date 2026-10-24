# Change Logs - KS<span style="color: red">e</span>F PDF Generator

<a href="https://github.com/sstybel/ksef-pdf-generator/releases/latest"><img alt="Static Badge" src="https://img.shields.io/badge/download-red?style=for-the-badge&label=stable&color=%23FF0000&link=https%3A%2F%2Fgithub.com%2Fsstybel%2Fksef-pdf-generator%2Freleases%2Flatest"></a> ![GitHub Release](https://img.shields.io/github/v/release/sstybel/ksef-pdf-generator?sort=date&display_name=release&style=for-the-badge&logo=github&label=release&link=https%3A%2F%2Fgithub.com%2Fsstybel%2Fksef-pdf-generator) ![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/sstybel/ksef-pdf-generator/total?style=for-the-badge&logo=github&link=https%3A%2F%2Fgithub.com%2Fsstybel%2Fksef-pdf-generator)

### [1.11.0]
---
In version [**1.11.0 releases**](https://github.com/sstybel/ksef-pdf-generator/releases/tag/1.11.0), includes bug fixes and updates to the code based on version [**1.1.46**](https://github.com/CIRFMF/ksef-pdf-generator/releases/tag/1.1.46) from the fork **https://github.com/CIRFMF/ksef-pdf-generator** ([**@CIRF**](https://github.com/CIRFMF)). Full list of changes:

**Added**
* Added formatting for the invoice number in the header.
* Added a space in the headers of **RR and PEF invoices**.
* Added an additional space in the header after the "KSeF Number" label.
* Added support for **XML** files in **UTF-16** format.
* Added a generic type for verifying the consistency of translation keys.
* Added currency code to transaction conditions.
* Added support for **PEF invoices** (in the testing phase; not currently available in the production version of the taxpayer’s application).

**Updated**
* Refactored the **PEF** correction invoice.
* The decimal separator for the "Discount" field in the bulk adjustment has been standardized.
* The decimal separator for the "Tax Amount" field in the tax rate summary within the **OSS procedure** has been standardized.
* Amount rounding has been corrected.
* The **jsdom** version has been updated.
* **PEF invoices** have been refactored—they will be available in production with this release.
* The description regarding the number of parts in a **UPO** document has been corrected.
* Debug mode has been disabled.
* The version of **pdfmake** has been updated.

### [1.10.0]
---
In version [**1.10.0 releases**](https://github.com/sstybel/ksef-pdf-generator/releases/tag/1.10.0), includes bug fixes and updates to the code based on version [**1.1.31**](https://github.com/CIRFMF/ksef-pdf-generator/releases/tag/1.1.31) from the fork **https://github.com/CIRFMF/ksef-pdf-generator** ([**@CIRF**](https://github.com/CIRFMF)). Full list of changes:

**Added**
* Added the ability to display all invoice line items in a bulk adjustment.

**Updated**
* Modified the visibility of field P_15; it is now always displayed.
* Fixed an issue with generating translations of order line items in languages other than Polish (i.e., en - English, de - German)

### [1.9.0]
---
In version [**1.9.0 releases**](https://github.com/sstybel/ksef-pdf-generator/releases/tag/1.9.0), includes bug fixes and updates to the code based on version [**1.1.30**](https://github.com/CIRFMF/ksef-pdf-generator/releases/tag/1.1.30) from the fork **https://github.com/CIRFMF/ksef-pdf-generator** ([**@CIRF**](https://github.com/CIRFMF)). Full list of changes:

**Added**
* Added `configureFonts()`. A method for registering a custom font.
* Added the date the **KSeF** number was assigned.
* Translation of KSeF invoices into English (**en**) and German (**de**). The default translation is in Polish (**pl**).

**Updated**
* Standardized the decimal separator for the OSS tax rate.
* Corrected the description for the UU_IDZ field.
* Standardized the column names for procedure designations.
* The naming convention for the total amount due in adjustments has been standardized.
* The name "simplified three-party transaction" for field P_23 has been changed.
* Date formatting in annotations for intra-Community supplies of new means of transport has been corrected.
* The decimal separator for the ZZP rate has been standardized.
* The decimal separator for the excise tax amount has been standardized.
* An extra blank page at the end of the invoice preview has been removed.
* The decimal separator in the "Quantity" column of the order table has been standardized.
* A currency code has been added to the order summary and payment amounts (advance payments).

### [1.8.0]
---
In version [**1.8.0 releases**](https://github.com/sstybel/ksef-pdf-generator/releases/tag/1.8.0), includes bug fixes and updates to the code based on version [**1.1.19**](https://github.com/CIRFMF/ksef-pdf-generator/releases/tag/1.1.19) from the fork **https://github.com/CIRFMF/ksef-pdf-generator** ([**@CIRF**](https://github.com/CIRFMF)) and add fix bug with double-escaped ampersands implemented by [**@FoolFresco (Vitalii Tanchuk)**](https://github.com/FoolFresco) 👍.

### [1.7.0]
---
In version [**1.7.0 releases**](https://github.com/sstybel/ksef-pdf-generator/releases/tag/1.7.0), includes bug fixes and updates to the code based on version [**1.1.18**](https://github.com/CIRFMF/ksef-pdf-generator/releases/tag/1.1.18) from the fork **https://github.com/CIRFMF/ksef-pdf-generator** ([**@CIRF**](https://github.com/CIRFMF)).

### [1.6.0]
---
In version [**1.6.0 releases**](https://github.com/sstybel/ksef-pdf-generator/releases/tag/1.6.0), the display of periods for invoices **FA1**, **FA2**, and **FA3** (**OkresFa.P_6_Od** and **OkresFa.P_6_Do**) has been corrected. This will place the generated content in the location for variants with two dates and one date. Fix (Pull request: [**Fix OkresFa period scope nesting
#7**](https://github.com/sstybel/ksef-pdf-generator/pull/7)) implemented by [**@lkow (Łukasz Kowalski)**](https://github.com/lkow) 👍.

### [1.5.5]
---
In version [**1.5.5 releases**](https://github.com/sstybel/ksef-pdf-generator/releases/tag/1.5.5), the issue described by ([**Attilasix**](https://github.com/Attilasix) - Issue: [**attachment
 #5**](https://github.com/sstybel/ksef-pdf-generator/issues/5)) regarding an error in the XML attachments section (Attachment) has been resolved. Thanks to [**@lkow (Łukasz Kowalski)**](https://github.com/lkow), the problem has been fixed (Pull request: [**Fix attachment table row generation
#6**](https://github.com/sstybel/ksef-pdf-generator/pull/6)) 👍.

### [1.5.0]
---
To this version [**1.5.0 releases**](https://github.com/sstybel/ksef-pdf-generator/releases/tag/1.5.0), the tool now includes support for localization and translation through the use of the i18next library. Fixed an issue with correctly generating dates in the **DD.MM.YYYY** (e.g. **14.05.2026**) pattern.

### [1.4.5]
---
In this version [**1.4.5 releases**](https://github.com/sstybel/ksef-pdf-generator/releases/tag/1.4.5), we have added support for **RR invoices** (**FA-RR**) and made improvements to streamline the invoice generation process. Support for converting the **` & `** character to the HTML tag **`&amp`** has also been added, and the **`<![CDATA[ ... ]]>`** tag has been removed from the **KSeF invoice** file in **XML** format.

### [1.4.0]
---
In version [**1.4.0 releases**](https://github.com/sstybel/ksef-pdf-generator/releases/tag/1.4.0), fixes have been made to the generation of invoice verification links in the **KSeF** system.

### [1.3.5]
---
In version [**1.3.5 releases**](https://github.com/sstybel/ksef-pdf-generator/releases/tag/1.3.5), the default behavior when a **KSeF PDF** invoice file exists has been changed so that the **KSeF** invoice **PDF** file is not overwritten. In addition, a parameter has been added that can change this behavior, resulting in **KSeF** invoice **PDF** files being overwritten.

### [1.3.1]
---
Since version [**1.3.1 releases**](https://github.com/sstybel/ksef-pdf-generator/releases/tag/1.3.1), as suggested by [**@niutech**](https://github.com/niutech), to ensure long-term archiving, the **PDF** file is created in accordance with the **PDF/A-3** standard - **ISO 19005-3:2012**.  This standard ensures long-term archiving based on **PDF version 1.7**, which allows any data formats (e.g., **XML**, **CSV**, **CAD**, source **Word files**) to be embedded within the **PDF** file. **PDF** is a *"container"* that combines visual consistency with the original (for viewing) and raw data for automatic processing.

### [1.2.0]
---
Since version [**1.2.0 releases**](https://github.com/sstybel/ksef-pdf-generator/releases/tag/1.2.0), two parameters have been added:
* Silent mode (default: disabled)
* Show emoticons (default: disabled)

### [1.1.0]
---
Starting with version [**1.1.0 releases**](https://github.com/sstybel/ksef-pdf-generator/releases/tag/1.1.0), it is now possible to convert KSeF **XML** invoices to **PDF** files based on the status of downloaded KSeF **XML** invoices using the [**KSeF XML Downloader**](https://github.com/sstybel/ksef-xml-download) tool . The [**KSeF XML Downloader**](https://github.com/sstybel/ksef-xml-download) tool saves the result of its operation, among other things, to a **JSON** file, which contains, among other things, the location of invoices in KSeF **XML** format. This file (**JSON**) can now be used as a source to indicate the location of **KSeF XML** invoice files.

## Download

<a href="https://github.com/sstybel/ksef-pdf-generator/releases/latest"><img alt="Static Badge" src="https://img.shields.io/badge/download-red?style=for-the-badge&label=stable&color=%23FF0000&link=https%3A%2F%2Fgithub.com%2Fsstybel%2Fksef-pdf-generator%2Freleases%2Flatest"></a> ![GitHub Release](https://img.shields.io/github/v/release/sstybel/ksef-pdf-generator?sort=date&display_name=release&style=for-the-badge&logo=github&label=release&link=https%3A%2F%2Fgithub.com%2Fsstybel%2Fksef-pdf-generator) ![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/sstybel/ksef-pdf-generator/total?style=for-the-badge&logo=github&link=https%3A%2F%2Fgithub.com%2Fsstybel%2Fksef-pdf-generator)

##  GitHub

[![GitHub Stats](https://github-stats-extended.vercel.app/api?username=sstybel&rank_icon=github&show=reviews%2Cdiscussions_started%2Cdiscussions_answered%2Cprs_merged%2Cprs_merged_percentage%2Cprs_commented%2Cprs_reviewed%2Cissues_commented%2Ccontributions%2Call_time_contribs&show_icons=true&include_all_commits=true&theme=aura_dark)](https://github-stats-extended.vercel.app/api?username=sstybel&rank_icon=github&show=reviews%2Cdiscussions_started%2Cdiscussions_answered%2Cprs_merged%2Cprs_merged_percentage%2Cprs_commented%2Cprs_reviewed%2Cissues_commented%2Ccontributions%2Call_time_contribs&show_icons=true&include_all_commits=true&theme=aura_dark)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[![GitHub Stats](https://github-stats-extended.vercel.app/api/top-langs?username=sstybel&langs_count=6&theme=monokai)](https://github-stats-extended.vercel.app/api/top-langs?username=sstybel&langs_count=6&theme=monokai)

&nbsp;

---

## Copyright &copy; 2025 - 2026 by Sebastian Stybel, [www.BONO-IT.pl](https://www.bono-it.pl/)
