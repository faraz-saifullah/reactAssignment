import jwtDecode from 'jwt-decode';
import { I18n } from 'react-redux-i18n';
import { getApiBaseUrl, ID_TOKEN_KEY } from '../const';
import {
  resetProfile,
  fetchAccountProfile,
  accountProfileFailure,
  accountProfileSuccess,
  accountProfileRequest
} from './profile';
import { fetchWithCookie } from '../utils';
import history from './../history';
import { toast } from 'react-toastify';

const API_BASE_URI = getApiBaseUrl();

/** ------------------------------------------------------------- **/
/** Login Actions **/
/** ------------------------------------------------------------- **/
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const CLEAR_LOGIN_ERRORS = 'CLEAR_LOGIN_ERRORS';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';
export const SET_ROLE = 'SET_ROLE';
export const REGISTRATION_REQUEST = 'REGISTRATION_REQUEST';
export const REGISTRATION_SUCCESS = 'REGISTRATION_SUCCESS';
export const REGISTRATION_FAILURE = 'REGISTRATION_FAILURE';
export const REGISTRATION_CLEAR_ERRORS = 'REGISTRATION_CLEAR_ERRORS';

export const FORGOT_PASSWORD_REQUEST = 'FORGOT_PASSWORD_REQUEST';
export const FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS';
export const FORGOT_PASSWORD_FAILURE = 'FORGOT_PASSWORD_FAILURE';

export const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILURE = 'RESET_PASSWORD_FAILURE';
export const RESET_PASSWORD_RESET = 'RESET_PASSWORD_RESET';

export const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB';

function requestLogin() {
  return {
    type: LOGIN_REQUEST,
  };
}

export function receiveLogin(user) {
  return {
    type: LOGIN_SUCCESS,
    role: user.role,
    id_token: user.id_token,
    email: user.email,
  };
}

function loginError(message) {
  return {
    type: LOGIN_FAILURE,
    message,
  };
}

export function forgotPasswordError(message) {
  return {
    type: FORGOT_PASSWORD_FAILURE,
    message,
  };
}

function removeLoginErrors() {
  return {
    type: CLEAR_LOGIN_ERRORS,
  };
}

function requestLogout() {
  return {
    type: LOGOUT_REQUEST,
  };
}

function receiveLogout() {
  return {
    type: LOGOUT_SUCCESS,
  };
}

export function clearLoginErrors() {
  return dispatch => {
    dispatch(removeLoginErrors());
  };
}

export function registrationClearErrors() {
  return {
    type: REGISTRATION_CLEAR_ERRORS,
  };
}

export function handleLoginError(message) {
  return dispatch => {
    dispatch(loginError(message));
  };
}

export const ACCOUNT_NOT_VERIFIED = 'ACCOUNT_NOT_VERIFIED';

function accountNotVerified() {
  return {
    type: ACCOUNT_NOT_VERIFIED,
  };
}

export function loginUser(creds) {
  const payload = {
    email: creds.email,
    password: creds.password,
  };

  const config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };

  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API

    dispatch(requestLogin());
    return fetchWithCookie(`${API_BASE_URI}/auth`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(loginError(body.message));
          return Promise.reject(body.message);
        }
        // If login was successful, set the token in local storage
        localStorage.setItem(ID_TOKEN_KEY, body.token);

        const user = {
          token: body.token,
          role: jwtDecode(body.token).roles[0],
          email: payload.email,
        };

        // Dispatch the success action
        dispatch(receiveLogin(user));
        dispatch(registrationClearErrors());
        // dispatch(fetchUsers());

        const configForProfile = {
          headers: {
            Authorization: `${body.token}`,
          },
        };
        dispatch(accountProfileRequest());
        return fetchWithCookie(
          `${API_BASE_URI}/account/profile`,
          configForProfile
        )
          .then(resp => resp.json().then(body => ({ body, resp })))
          .then(({ body, resp }) => {
            if (!resp.ok) {
              switch (resp.status) {
                case 401:
                  dispatch(accountProfileFailure('Internal server error'));
                default:
                  return Promise.reject('Failed to retrieve profile');
              }
            }
            if (body.verified == false) {
              dispatch(accountNotVerified());
              return true;
            }
            history.push('/all-ideas');
            return true;
          });
      })
      .catch(err => {
        dispatch(loginError(err));
      });
  };
}

export function logoutUser() {
  return dispatch => {
    dispatch(requestLogout());
    dispatch(resetProfile());
    localStorage.removeItem(ID_TOKEN_KEY);
    dispatch(receiveLogout());
    history.push('/');
  };
}

function setRole(role) {
  return {
    type: SET_ROLE,
    role,
  };
}

export function setRoleFromJwt() {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  if (token && token !== 'undefined') {
    const decodedToken = jwtDecode(token);
    if (decodedToken.roles) {
      const role = decodedToken.roles[0];

      return dispatch => {
        dispatch(setRole(role));
        if (role === 'ROLE_USER') {
          history.push('/all-ideas');
        } else {
          history.push('/statistics');
        }
      };
    }
  }
  return dispatch => {
    dispatch(setRole('ROLE_NONE'));
    if (window.location.pathname !== '/') {
      localStorage.removeItem(ID_TOKEN_KEY);
      history.push('/');
    }
  };
}

/** ------------------------------------------------------------- **/
/** Register Actions **/
/** ------------------------------------------------------------- **/

function requestRegistration() {
  return {
    type: REGISTRATION_REQUEST,
  };
}

function receiveRegistration(user) {
  return {
    type: REGISTRATION_SUCCESS,
    id_token: user.id_token,
  };
}

function registrationError(message) {
  return {
    type: REGISTRATION_FAILURE,
    message,
  };
}

export function handleRegistrationError(message) {
  return dispatch => {
    dispatch(registrationError(message));
  };
}

export function registerUser(creds) {
  const payload = {
    fullName: creds.fullName,
    firstName: creds.fullName,
    lastName: creds.fullName,
    email: creds.email,
    confirmEmail: creds.email,
    password: creds.password,
    confirmPassword: creds.confirmPassword,
    inviteString: creds.inviteString,
  };

  const config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };

  return dispatch => {
    dispatch(requestRegistration());

    return fetchWithCookie(`${API_BASE_URI}/auth/create`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(handleRegistrationError(body.message));
          return Promise.reject(body.message);
        }
        localStorage.setItem(ID_TOKEN_KEY, body.token);
        // Dispatch the success action
        dispatch(receiveRegistration(body));
        const user = {
          token: body.token,
          role: jwtDecode(body.token).roles[0],
        };
        dispatch(receiveLogin(user));
        dispatch(registrationClearErrors());
        const configForProfile = {
          headers: {
            Authorization: `${body.token}`,
          },
        };
        dispatch(accountProfileRequest());
        return fetchWithCookie(
          `${API_BASE_URI}/account/profile`,
          configForProfile
        )
          .then(resp => resp.json().then(body => ({ body, resp })))
          .then(({ body, resp }) => {
            if (!resp.ok) {
              switch (resp.status) {
                case 401:
                  dispatch(accountProfileFailure('Internal server error'));
                  return Promise.reject(new Error('Failed to retrieve profile'));
                default:
                  return Promise.reject(new Error('Failed to retrieve profile'));
              }
            }
            if (body.verified === false) {
              dispatch(accountNotVerified());
              history.push('/verify_email');
              return true;
            }
            history.push('/all-ideas');
            return true;

          });
      })
      .catch(err => {
        dispatch(registrationError(err));
      });
  };
}

export const RESENT_EMAIL_SUCCESS = 'RESENT_EMAIL_SUCCESS';

export function resentEmailSuccess() {
  return {
    type: RESENT_EMAIL_SUCCESS,
  };
}

export const RESENT_EMAIL_NOTIFIED = 'RESENT_EMAIL_VERIFIED';

export function resentEmailNotified() {
  return {
    type: RESENT_EMAIL_NOTIFIED,
  };
}

export function resendVerifyEmail() {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;

  let config = {
    method: 'GET',
  };

  if (token && token !== 'undefined') {
    config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
  } else {
    throw 'No token saved!';
  }

  return dispatch => {
    const ApiURL = `${API_BASE_URI}/auth/verification/resend`;
    return fetchWithCookie(ApiURL, config)
      .then(resp => resp.json())
      .then(json => {
        if (json.sent) {
          dispatch(resentEmailSuccess());
          toast.success(I18n.t('auth.confirmVerifyEmail'))
        }
      });
  };
}

/** ------------------------------------------------------------- **/
/** Forget Password Actions **/
/** ------------------------------------------------------------- **/

function forgotPasswordSuccess(response) {
  return {
    type: FORGOT_PASSWORD_SUCCESS,
    email: response.email,
    sent: response.sent,
  };
}

function forgotPasswordRequest(email) {
  return {
    type: FORGOT_PASSWORD_REQUEST,
    email,
  };
}

export function forgotPassword(payload) {
  const config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };
  return dispatch => {
    dispatch(forgotPasswordRequest(payload.email));
    fetchWithCookie(`${API_BASE_URI}/auth/forgot`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(forgotPasswordError(body.message));
          return Promise.reject(body.message);
        }
        if (body.sent) {
          dispatch(forgotPasswordSuccess(body));
        } else {
          dispatch(forgotPasswordError('The request could not be processed. Error sending mail. Ask the administrator.'));
        }
        return true;
      })
      .catch(err => {
        dispatch(forgotPasswordError(err));
      });
  };
}

function resetPasswordRequest() {
  return {
    type: RESET_PASSWORD_REQUEST,
  };
}

export function resetPasswordError(message) {
  return {
    type: RESET_PASSWORD_FAILURE,
    message,
  };
}

export function resetPasswordReset() {
  return {
    type: RESET_PASSWORD_RESET
  };
}

function resetPasswordSuccess() {
  return {
    type: RESET_PASSWORD_SUCCESS,
  };
}

export function resetPassword(payload) {
  const config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };
  return dispatch => {
    dispatch(resetPasswordRequest(payload));
    fetchWithCookie(`${API_BASE_URI}/auth/reset`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(resetPasswordError(body.message));
          return Promise.reject(body.message);
        }
        dispatch(resetPasswordSuccess());
        return true;
      })
      .catch(err => {
        dispatch(resetPasswordError(err));
      });
  };
}

export function setActiveTab(tab) {
  return {
    type: SET_ACTIVE_TAB,
    tab,
  };
}
