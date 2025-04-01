import { describe, it, expect, vi } from 'vitest';
import { DurableObjectsNoSQL } from './index';
import type { DurableObjectStorage } from './types';

describe('DurableObjectsNoSQL', () => {
  it('should export the DurableObjectsNoSQL class', () => {
    expect(DurableObjectsNoSQL).toBeDefined();
    expect(typeof DurableObjectsNoSQL).toBe('function');
  });

  it('should be instantiable with a storage object', () => {
    const mockStorage = {
      sql: {
        exec: vi.fn()
      },
      transaction: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    } as unknown as DurableObjectStorage;

    const db = new DurableObjectsNoSQL(mockStorage);
    
    expect(db).toBeDefined();
    expect(db).toBeInstanceOf(DurableObjectsNoSQL);
  });
});
