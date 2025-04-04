import { describe, it, expect } from 'vitest';
import { goals, GoalsClient } from './index.js';

describe('goals.do SDK', () => {
  it('exports a default client instance', () => {
    expect(goals).toBeInstanceOf(GoalsClient);
  });

  it('allows creating a custom client', () => {
    const client = new GoalsClient({ baseUrl: 'https://custom.goals.do' });
    expect(client).toBeInstanceOf(GoalsClient);
  });
});
