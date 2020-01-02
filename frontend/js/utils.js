import jwtDecode from 'jwt-decode';
import { getApiBaseUrl, ID_TOKEN_KEY } from 'const';
import Cookie from 'js-cookie';
import history from './history';

const API_BASE_URI = getApiBaseUrl();

export async function fetchWithAuth(url, config) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let lang = Cookie.get('lang');

  if (lang == undefined) {
    lang = 'en';
  }
  if (config.headers == undefined) {
    config.headers = {};
  }
  config.headers['X-Ims-Lang'] = lang;
  if (token != null && token.length > 30 && token !== 'undefined') {
    const decodedToken = jwtDecode(token);
    const expired = decodedToken.expiry;
    const now = new Date().getTime();
    if (now > expired) {
      await fetch(API_BASE_URI + '/refresh', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
          'X-Ims-Lang': lang,
        },
      })
        .then(resp => resp.json())
        .then(json => {
          if (json.token) {
            localStorage.setItem(ID_TOKEN_KEY, json.token);
            config.headers.Authorization = json.token;
          } else {
          }
        })
        .catch(error => {
          localStorage.removeItem(ID_TOKEN_KEY);
          history.push('/');
        });
    }
  } else {
    localStorage.removeItem(ID_TOKEN_KEY);
    history.push('/');
  }

  const res = await fetch(url, config);
  if (res.status === 401) {
    localStorage.removeItem(ID_TOKEN_KEY);
    history.push('/');
  }
  return res;
}

export async function fetchWithCookie(url, config) {
  let lang = Cookie.get('lang');
  if (lang == undefined) {
    lang = 'en';
  }
  if (config.headers == undefined) {
    config.headers = {};
  }
  config.headers['X-Ims-Lang'] = lang;
  return await fetch(url, config);
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const validEmailPattern = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

export function validateEmail(email) {
  return validEmailPattern.test(email);
}

export const validDomainPattern = /^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/;

export function checkIsValidDomain(domain) {
  return validDomainPattern.test(domain);
}

export function getRandomNumber() {
  return Math.random().toString(36);
}
