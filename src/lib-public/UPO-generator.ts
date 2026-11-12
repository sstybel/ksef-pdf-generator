import pdfMake, { TCreatedPdf } from 'pdfmake/build/pdfmake';
import { Upo } from './types/upo-v4_2.types';
import { TDocumentDefinitions, Attachment } from 'pdfmake/interfaces';
import { generateStyle } from '../shared/PDF-functions';
import { generateDokumentUPO } from './generators/UPO4_3/Dokumenty';
import { generateNaglowekUPO } from './generators/UPO4_3/Naglowek';
import { generateStopka } from './generators/common/Stopka';
import { Position } from '../shared/enums/common.enum';
import i18n from 'i18next';
import { AdditionalDataTypes } from './types/common.types';
import { generateWatermark } from '../shared/consts/watermark';
import { generateInfo } from '../shared/utils/generate-info';

export function generatePDFUPO(upo: Upo, additionalData?: Pick<AdditionalDataTypes, 'watermark' | 'creator'>, dataUri?: string, filename?: string, dateInv?: Date, dateInvStor?: Date, description?: string, relationship?: string): TCreatedPdf {
  const docDefinition: TDocumentDefinitions = {
    info: generateInfo(additionalData?.creator),
    ...generateWatermark(additionalData?.watermark),
    version: '1.7',
    subset: 'PDF/A-3',
    tagged: true,
    content: [
      generateNaglowekUPO(upo.Potwierdzenie!), 
      generateDokumentUPO(upo.Potwierdzenie!),
      ...generateStopka(undefined, undefined, undefined, undefined, undefined),
    ],
    ...generateStyle(),
    pageSize: 'A4',
    pageOrientation: 'landscape',
    ...(dataUri && { files: { xml: { src: dataUri, name: filename, hidden: false, relationship: relationship, description: description, creationDate: dateInv, modifiedDate: dateInvStor, type: 'application/xml' } as Attachment } }),
    footer: function (currentPage: number, pageCount: number) {
      return {
        text: `${currentPage.toString()} ${i18n.t('invoice.footer.pagesTotal')} ${pageCount}`,
        alignment: Position.RIGHT,
        margin: [0, 0, 20, 0],
      };
    },
  };

  return pdfMake.createPdf(docDefinition);
}






