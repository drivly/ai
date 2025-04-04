import { describe, it, expect, vi } from 'vitest';
import { createCronDurableObject, CronDurableObject } from './index';

const mockStorage = {
  setAlarm: vi.fn().mockResolvedValue(undefined),
  getAlarm: vi.fn().mockResolvedValue(null),
  deleteAlarm: vi.fn().mockResolvedValue(undefined),
  put: vi.fn().mockResolvedValue(undefined),
  get: vi.fn().mockResolvedValue(null),
  delete: vi.fn().mockResolvedValue(false),
  list: vi.fn().mockResolvedValue(new Map()),
  blockConcurrencyWhile: vi.fn().mockImplementation(async (callback) => {
    await callback();
  }),
};

const mockState = {
  storage: mockStorage,
  blockConcurrencyWhile: vi.fn().mockImplementation(async (callback) => {
    await callback();
  }),
};

describe('durable-objects-cron', () => {
  it('exports createCronDurableObject function', () => {
    expect(createCronDurableObject).toBeDefined();
    expect(typeof createCronDurableObject).toBe('function');
  });

  it('exports CronDurableObject class', () => {
    expect(CronDurableObject).toBeDefined();
    expect(typeof CronDurableObject).toBe('function');
  });

  it('creates a CronDurableObject instance', () => {
    const cronDO = new CronDurableObject(mockState as any, {});
    expect(cronDO).toBeDefined();
    expect(cronDO).toBeInstanceOf(CronDurableObject);
  });

  it('sets an alarm on initialization', () => {
    new CronDurableObject(mockState as any, {});
    expect(mockState.blockConcurrencyWhile).toHaveBeenCalled();
    expect(mockStorage.setAlarm).toHaveBeenCalled();
  });
});
