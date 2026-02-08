import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api, setCsrfToken, clearCsrfToken } from '../client';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('api client', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    clearCsrfToken();
  });

  describe('api.get()', () => {
    it('sends GET request to /api/v1 with credentials', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { items: [] } }),
      });

      const data = await api.get('/dashboard');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/dashboard',
        expect.objectContaining({
          credentials: 'include',
        })
      );
      expect(data).toEqual({ items: [] });
    });

    it('throws on HTTP error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ success: false, error: 'Non autorise' }),
      });

      await expect(api.get('/me')).rejects.toThrow('Non autorise');
    });

    it('throws on success:false even with ok status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false, error: 'Bad request' }),
      });

      await expect(api.get('/test')).rejects.toThrow('Bad request');
    });
  });

  describe('api.post()', () => {
    it('sends POST with JSON body and CSRF token', async () => {
      setCsrfToken('test-csrf-token');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { id: 1 } }),
      });

      const data = await api.post('/responses', { points: 3 });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/responses',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ points: 3 }),
        })
      );
      expect(data).toEqual({ id: 1 });
    });

    it('auto-fetches CSRF token if not cached', async () => {
      // First call: CSRF fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { csrf: 'fetched-token' } }),
      });
      // Second call: actual POST
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: {} }),
      });

      await api.post('/login', { username: 'prof' });

      expect(mockFetch.mock.calls[0][0]).toBe('/api/v1/csrf');
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('setCsrfToken / clearCsrfToken', () => {
    it('setCsrfToken prevents auto CSRF fetch', async () => {
      setCsrfToken('manual-token');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: {} }),
      });

      await api.post('/test', {});

      // Only one fetch (the POST), no CSRF fetch
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
