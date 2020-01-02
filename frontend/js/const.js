// export const API_BASE_URI = 'http://18.136.206.119:8080';
// export const API_BASE_URI = 'http://localhost:8080';
export const API_BASE_URI = 'https://test.idexinnovation.com:8080';

export const ID_TOKEN_KEY = 'id_token';

export function getApiBaseUrl() {
  if (API_BASE_URI.includes('https') || API_BASE_URI.includes('http')) {
    return API_BASE_URI;
  }
  // eslint-disable-next-line no-restricted-globals
  return `${location.origin}/${API_BASE_URI}`;
}
