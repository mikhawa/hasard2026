import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

export function useApi(url, { immediate = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (overrideUrl) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get(overrideUrl || url);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (immediate && url) {
      execute();
    }
  }, [url, immediate, execute]);

  return { data, loading, error, refetch: execute };
}
