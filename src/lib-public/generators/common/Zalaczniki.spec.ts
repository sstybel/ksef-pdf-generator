import { describe, expect, it } from 'vitest';
import { chunkArray, generateZalaczniki } from './Zalaczniki';

function findTableBodies(node: unknown, result: unknown[][][] = []): unknown[][][] {
  if (!node || typeof node !== 'object') {
    return result;
  }

  if ('table' in node && node.table && typeof node.table === 'object' && 'body' in node.table) {
    result.push(node.table.body as unknown[][]);
  }

  if (Array.isArray(node)) {
    node.forEach((child) => findTableBodies(child, result));
    return result;
  }

  Object.values(node).forEach((child) => findTableBodies(child, result));
  return result;
}

describe('chunkArray', () => {
  it('should return empty array if input is not array', () => {
    expect(chunkArray(null as any)).toEqual([]);
    expect(chunkArray(undefined as any)).toEqual([]);
    expect(chunkArray({} as any)).toEqual([]);
  });

  it('should return one chunk if columns length <= 7', () => {
    const arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

    expect(chunkArray(arr)).toEqual([arr]);
    expect(chunkArray(arr.slice(0, 5))).toEqual([arr.slice(0, 5)]);
  });

  it('should split into two equal parts when columns between 8 and 14 and even', () => {
    const arr = Array.from({ length: 8 }, (_, i) => i);
    const result = chunkArray(arr);

    expect(result.length).toBe(2);
    expect(result[0].length).toBe(4);
    expect(result[1].length).toBe(5);
  });

  it('should split into two parts with first bigger by 1 when odd columns between 8 and 14', () => {
    const arr = Array.from({ length: 9 }, (_, i) => i);
    const result = chunkArray(arr);

    expect(result.length).toBe(2);
    expect(result[0].length).toBe(5);
    expect(result[1].length).toBe(5);
  });

  it('should split into three parts with roughly equal parts for columns > 14', () => {
    const arr = Array.from({ length: 18 }, (_, i) => i);
    const result = chunkArray(arr);

    expect(result.length).toBe(3);
    expect(result[0].length).toBe(6);
    expect(result[1].length).toBe(7);
    expect(result[2].length).toBe(7);
  });

  it('should split 20 columns into 7,7,and 6', () => {
    const arr = Array.from({ length: 20 }, (_, i) => i);
    const result = chunkArray(arr);

    expect(result.length).toBe(3);
    expect(result[0].length).toBe(7);
    expect(result[1].length).toBe(8);
    expect(result[2].length).toBe(7);
  });

  it('should split 15 columns into 5,5,5', () => {
    const arr = Array.from({ length: 15 }, (_, i) => i);
    const result = chunkArray(arr);

    expect(result.length).toBe(3);
    expect(result[0].length).toBe(5);
    expect(result[1].length).toBe(6);
    expect(result[2].length).toBe(6);
  });
});

describe('generateZalaczniki', () => {
  it('should render attachment table body rows as row arrays', () => {
    const result = generateZalaczniki({
      BlokDanych: {
        ZNaglowek: { _text: 'Settlement details' },
        Tabela: {
          TNaglowek: {
            Kol: [
              { NKom: { _text: 'No.' } },
              { NKom: { _text: 'Description' } },
              { NKom: { _text: 'Period' } },
              { NKom: { _text: 'Amount' } },
            ],
          },
          Wiersz: [
            {
              WKom: [
                { _text: '1' },
                { _text: 'Subscription' },
                { _text: '2026-05' },
                { _text: '123.00' },
              ],
            },
          ],
        },
      },
    } as any);

    const bodies = findTableBodies(result);
    const attachmentBody = bodies.find((body) => body.some((row) => Array.isArray(row) && row.length === 4));

    expect(attachmentBody).toBeDefined();
    expect(attachmentBody?.every(Array.isArray)).toBe(true);
    expect(attachmentBody?.[1]).toHaveLength(4);
  });
});







