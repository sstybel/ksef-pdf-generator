import { beforeAll, describe, expect, it } from 'vitest';
import { initI18next } from '../../i18n/i18n-init';
import { generateSzczegoly as generateFA1Szczegoly } from '../FA1/Szczegoly';
import { generateSzczegoly as generateFA2Szczegoly } from '../FA2/Szczegoly';
import { generateSzczegoly as generateFA3Szczegoly } from '../FA3/Szczegoly';

type GenerateSzczegoly = (fa: any) => any[];

function collectTextValues(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectTextValues);
  }

  if (value && typeof value === 'object' && 'text' in value) {
    return collectTextValues((value as { text?: unknown }).text);
  }

  return [];
}

function extractOkresFaColumnItem(section: any[]): unknown {
  const sectionContent = section[0].stack.find((item: unknown): item is any[] => Array.isArray(item));
  const twoColumns = sectionContent.find((item: { columns?: unknown }) => item?.columns);

  return twoColumns.columns[1].stack[0][0][0];
}

describe('OkresFa period scope', () => {
  beforeAll(async () => {
    await initI18next();
  });

  const generators: { name: string; generate: GenerateSzczegoly; createFa: (okresFa: any) => any }[] = [
    {
      name: 'FA1',
      generate: generateFA1Szczegoly,
      createFa: (okresFa) => ({
        FaWiersze: { FaWiersz: [] },
        Zamowienie: { ZamowienieWiersz: [] },
        RodzajFaktury: { _text: 'VAT' },
        P_1: { _text: '2024-02-01' },
        OkresFa: okresFa,
      }),
    },
    {
      name: 'FA2',
      generate: generateFA2Szczegoly,
      createFa: (okresFa) => ({
        FaWiersz: [],
        Zamowienie: { ZamowienieWiersz: [] },
        RodzajFaktury: { _text: 'VAT' },
        P_1: { _text: '2024-02-01' },
        OkresFa: okresFa,
      }),
    },
    {
      name: 'FA3',
      generate: generateFA3Szczegoly,
      createFa: (okresFa) => ({
        FaWiersz: [],
        Zamowienie: { ZamowienieWiersz: [] },
        RodzajFaktury: { _text: 'VAT' },
        P_1: { _text: '2024-02-01' },
        OkresFa: okresFa,
      }),
    },
  ];

  const periodCases = [
    {
      name: 'P_6_Od/P_6_Do',
      okresFa: { P_6_Od: { _text: '2024-01-01' }, P_6_Do: { _text: '2024-01-31' } },
      expectedDates: ['01.01.2024', '31.01.2024'],
    },
    {
      name: 'P_6_Od',
      okresFa: { P_6_Od: { _text: '2024-01-01' } },
      expectedDates: ['01.01.2024'],
    },
    {
      name: 'P_6_Do',
      okresFa: { P_6_Do: { _text: '2024-01-31' } },
      expectedDates: ['31.01.2024'],
    },
  ];

  it.each(
    generators.flatMap(({ name: generatorName, generate, createFa }) =>
      periodCases.map((periodCase) => ({ generatorName, generate, createFa, ...periodCase }))
    )
  )('keeps $generatorName $name content at the same column item level', ({ generate, createFa, okresFa, expectedDates }) => {
    const okresFaColumnItem = extractOkresFaColumnItem(generate(createFa(okresFa)));

    expect(Array.isArray(okresFaColumnItem)).toBe(false);
    expect(collectTextValues(okresFaColumnItem)).toEqual(expect.arrayContaining(expectedDates));
  });
});
