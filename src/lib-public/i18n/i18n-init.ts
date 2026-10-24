import i18next from 'i18next';
import { pl } from './lang/pl';
import { en } from './lang/en';
import { de } from './lang/de';

export const i18nReady: Promise<void> = i18next
  .init({
    lng: 'pl',
    debug: false,
    showSupportNotice: false,
    resources: {
      pl: { translation: pl },
      de: { translation: de },
      en: { translation: en },
    },
  })
  .then(() => undefined);
