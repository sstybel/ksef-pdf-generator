import pdfMake from 'pdfmake/build/pdfmake';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { generatePDFUPO } from './UPO-generator';

describe('generatePDFUPO', () => {
  const dummyUpo = {
    Potwierdzenie: {
      field1: 'value1',
      field2: 'value2',
    },
  };

  beforeEach(() => {
    const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' });
    vi.spyOn(pdfMake, 'createPdf').mockImplementation(
      () =>
        ({
          getBlob: vi.fn(() => Promise.resolve(mockBlob)),
        }) as any
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully generates a PDF blob', async () => {
    const blob = generatePDFUPO(dummyUpo as any).getBlob();

    expect(blob).toBeInstanceOf(Blob);
    const text = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (): void => resolve(reader.result as string);
      reader.onerror = (): void => reject(reader.error);
      reader.readAsText(blob as unknown as Blob);
    });

    expect(text).toContain('pdf content');
  });

  it('creates a PDF from the UPO', () => {
    generatePDFUPO(dummyUpo as any);
    expect(pdfMake.createPdf).toHaveBeenCalled();
  });
});






