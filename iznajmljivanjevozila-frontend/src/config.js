// Centralna konfiguracija za API URL.
// Podrazumevano koristi lokalni backend na http://localhost:8000,
// a u produkciji se može podesiti promenljiva okruženja VITE_API_URL.

const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Ukloni završni "/" ako postoji, da izbegnemo duple "//" u pozivima
export const API_BASE_URL = rawBaseUrl.endsWith('/')
  ? rawBaseUrl.slice(0, -1)
  : rawBaseUrl;

// Helper koji pravi pun URL na osnovu relativne putanje,
// npr. apiUrl('/api/vehicles') -> 'http://localhost:8000/api/vehicles'
export const apiUrl = (path = '') => {
  if (!path) return API_BASE_URL;
  return path.startsWith('/') ? `${API_BASE_URL}${path}` : `${API_BASE_URL}/${path}`;
};

