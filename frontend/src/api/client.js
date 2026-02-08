const BASE = '/api/v1';

let csrfToken = null;

async function fetchCsrf() {
  const res = await fetch(`${BASE}/csrf`, { credentials: 'include' });
  const json = await res.json();
  csrfToken = json.data.csrf;
  return csrfToken;
}

async function getCsrfToken() {
  if (csrfToken) return csrfToken;
  return fetchCsrf();
}

export function clearCsrfToken() {
  csrfToken = null;
}

export function setCsrfToken(token) {
  csrfToken = token;
}

async function request(url, options = {}) {
  const config = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add CSRF token for state-changing requests
  if (config.method === 'POST' || config.method === 'PUT' || config.method === 'DELETE') {
    const token = await getCsrfToken();
    config.headers['X-CSRF-Token'] = token;
  }

  const res = await fetch(`${BASE}${url}`, config);
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || `Erreur ${res.status}`);
  }

  return json.data;
}

export const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) }),
};
