import { describe, it, expect, vi } from 'vitest';
import { api } from '../lib/api';

describe('API Service', () => {
  it('should have auth methods', () => {
    expect(api.auth.login).toBeDefined();
    expect(api.auth.register).toBeDefined();
    expect(api.auth.me).toBeDefined();
  });

  it('should have test methods', () => {
    expect(api.tests.generate).toBeDefined();
    expect(api.tests.start).toBeDefined();
    expect(api.tests.submit).toBeDefined();
  });
});
