import i18next from 'i18next';
import pl from './lang/pl.json';
import en from './lang/en.json';
import de from './lang/de.json';

export const i18nReady: Promise<void> = i18next
  .init({
    lng: 'pl',
    debug: false,
    resources: {
      pl: { translation: pl },
      en: { translation: en },
      de: { translation: de },
    },
  })
  .then(() => undefined);
