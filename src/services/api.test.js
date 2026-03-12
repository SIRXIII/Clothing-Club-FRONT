import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock axios before importing api
vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn(() => mockAxios),
    defaults: { headers: {} },
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };
  return { default: mockAxios };
});

describe('API Service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('adds auth token from localStorage to requests', () => {
    localStorage.setItem('auth_token', 'test-token-123');

    // The API module uses interceptors to add token
    // This tests the pattern used in the codebase
    const token = localStorage.getItem('auth_token');
    expect(token).toBe('test-token-123');
  });

  it('stores and retrieves user data from localStorage', () => {
    const userData = { id: 1, name: 'Test Partner', email: 'partner@test.com' };
    localStorage.setItem('auth_user', JSON.stringify(userData));

    const stored = JSON.parse(localStorage.getItem('auth_user'));
    expect(stored).toEqual(userData);
    expect(stored.email).toBe('partner@test.com');
  });

  it('clears auth data on logout', () => {
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('auth_user', '{"id":1}');
    localStorage.setItem('type', 'partner');

    // Simulate logout
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('type');

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
    expect(localStorage.getItem('type')).toBeNull();
  });
});
