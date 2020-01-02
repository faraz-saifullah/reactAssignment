import { getApiBaseUrl, ID_TOKEN_KEY } from '../const';
import { fetchWithAuth, fetchWithCookie } from '../utils';
import history from './../history';
import { setLocale, I18n } from 'react-redux-i18n';
import Cookie from 'js-cookie';

const API_BASE_URI = getApiBaseUrl();

export const ACCOUNT_PROFILE_REQUEST = 'ACCOUNT_PROFILE_REQUEST';
export const ACCOUNT_PROFILE_SUCCESS = 'ACCOUNT_PROFILE_SUCCESS';
export const ACCOUNT_PROFILE_FAILURE = 'ACCOUNT_PROFILE_FAILURE';

export const ACCOUNT_PROFILE_RESET = 'ACCOUNT_PROFILE_CLEAR';

export const UPLOAD_PROFILE_PICTURE_REQUEST = 'UPLOAD_PROFILE_PICTURE_REQUEST';
export const UPLOAD_PROFILE_PICTURE_SUCCESS = 'UPLOAD_PROFILE_PICTURE_SUCCESS';
export const UPLOAD_PROFILE_PICTURE_FAILURE = 'UPLOAD_PROFILE_PICTURE_FAILURE';

export const SET_PROFILE_EDIT_MODE = 'SET_PROFILE_EDIT_MODE';

export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';

export const SET_SHOW_CHANGE_PASSWORD_MODAL = 'SET_SHOW_CHANGE_PASSWORD_MODAL';

export const CHANGE_PASSWORD_REQUEST = 'CHANGE_PASSWORD_REQUEST';
export const CHANGE_PASSWORD_FAILURE = 'CHANGE_PASSWORD_FAILURE';
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';

export function accountProfileRequest() {
  return {
    type: ACCOUNT_PROFILE_REQUEST,
  };
}

export function accountProfileSuccess(body) {
  return {
    type: ACCOUNT_PROFILE_SUCCESS,
    body,
  };
}

export function accountProfileFailure(message) {
  return {
    type: ACCOUNT_PROFILE_FAILURE,
    message,
  };
}

export function fetchAccountProfile() {
  return dispatch => {
    const token = localStorage.getItem(ID_TOKEN_KEY) || null;
    let config = {};
    if (token && token !== 'undefined') {
      config = {
        headers: {
          Authorization: `${token}`,
        },
      };
    } else {
      /*
        this can only happen if someone is already on the contact us view
        and manually deletes the token from local storage, before clicking on send
        TODO: instead of throwing here we should redirect the user to the login/signup view
      */
      history.push('/');
      return dispatch(accountProfileFailure('No token Found'));
    }
    dispatch(accountProfileRequest());

    return fetchWithAuth(`${API_BASE_URI}/account/profile`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          switch (response.status) {
            case 401:
              localStorage.removeItem(ID_TOKEN_KEY);
              history.push('/');
            default:
              return Promise.reject(new Error('Failed to retrieve profile of logged in user'));
          }
        }
        if (!body.verified) {
          localStorage.removeItem(ID_TOKEN_KEY);
          history.push('/');
          return true;
        }
        dispatch(accountProfileSuccess(body));
        return true;
      })
      .catch(err => {
        dispatch(accountProfileFailure(`${err}`));
      });
  };
}

function uploadProfilePictureRequest() {
  return {
    type: UPLOAD_PROFILE_PICTURE_REQUEST,
  };
}

function uploadProfilePictureSuccess(body) {
  return {
    type: UPLOAD_PROFILE_PICTURE_SUCCESS,
    body,
  };
}

function uploadProfilePictureFailure(message) {
  return {
    type: UPLOAD_PROFILE_PICTURE_FAILURE,
    message,
  };
}

export function uploadProfilePicture(data) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {};
  if (token && token !== 'undefined') {
    config = {
      headers: {
        Authorization: `${token}`,
      },
      method: 'POST',
      body: data,
    };
  } else {
    /*
        this can only happen if someone is already on the contact us view
        and manually deletes the token from local storage, before clicking on send
        TODO: instead of throwing here we should redirect the user to the login/signup view
         */
    throw 'No token saved!';
  }

  return dispatch => {
    dispatch(uploadProfilePictureRequest());
    return fetchWithAuth(`${API_BASE_URI}/account/profile/picture`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          switch (response.status) {
            case 400:
              dispatch(uploadProfilePictureFailure(`${body.message}`));
              return true;
            case 401:
            // NOTE: should not happen as we should check if the token is valid before making the request
            default:
              return Promise.reject('Failed to upload profile picture');
          }
        }
        dispatch(uploadProfilePictureSuccess(body));
        return true;
      })
      .catch(err => {
        dispatch(uploadProfilePictureFailure(`${err}`));
      });
  };
}

function setProfileEditMode(edit) {
  return {
    type: SET_PROFILE_EDIT_MODE,
    edit,
  };
}

export function editProfile(edit) {
  return dispatch => {
    dispatch(setProfileEditMode(edit));
  };
}

function accountProfileReset() {
  return {
    type: ACCOUNT_PROFILE_RESET,
  };
}

export function resetProfile() {
  return dispatch => {
    dispatch(accountProfileReset());
  };
}

function updateProfileRequest() {
  return {
    type: UPDATE_PROFILE_REQUEST,
  };
}

function updateProfileSuccess(body) {
  return {
    type: UPDATE_PROFILE_SUCCESS,
    body,
  };
}

export function updateProfileFailure(message) {
  return {
    type: UPDATE_PROFILE_FAILURE,
    message,
  };
}

export function updateProfile(data, refreshToken) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {};
  if (token && token !== 'undefined') {
    config = {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    };
  } else {
    /*
        this can only happen if someone is already on the contact us view
        and manually deletes the token from local storage, before clicking on send
        TODO: instead of throwing here we should redirect the user to the login/signup view
         */
    throw 'No token saved!';
  }

  return dispatch => {
    dispatch(updateProfileRequest());

    return fetchWithAuth(`${API_BASE_URI}/account/profile`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          switch (response.status) {
            case 400:
              dispatch(updateProfileFailure(body));
              return true;
            case 401:
            // NOTE: should not happen as we should check if the token is valid before making the request
            default:
              return Promise.reject('Failed to update profile');
          }
        }
        if (refreshToken) {
          fetchWithCookie(`${API_BASE_URI}/refresh`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          })
            .then(resp => resp.json())
            .then(json => {
              localStorage.setItem(ID_TOKEN_KEY, json.token);
            });
        }
        dispatch(updateProfileSuccess(body));
        return true;
      })
      .catch(err => {
        const apiError = {
          message: err,
          details: {},
        };
        dispatch(updateProfileFailure(apiError));
      });
  };
}

function setShowChangePasswordModal(show) {
  return {
    type: SET_SHOW_CHANGE_PASSWORD_MODAL,
    show,
  };
}

export function showChangePasswordModal(show) {
  return dispatch => {
    dispatch(setShowChangePasswordModal(show));
  };
}

function changePasswordRequest() {
  return {
    type: CHANGE_PASSWORD_REQUEST,
  };
}

function changePasswordSuccess() {
  return {
    type: CHANGE_PASSWORD_SUCCESS,
  };
}

export function changePasswordFailure(message) {
  return {
    type: CHANGE_PASSWORD_FAILURE,
    message,
  };
}

export function changePassword(data) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {};
  if (token && token !== 'undefined') {
    config = {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    };
  } else {
    /*
        this can only happen if someone is already on the contact us view
        and manually deletes the token from local storage, before clicking on send
        TODO: instead of throwing here we should redirect the user to the login/signup view
         */
    throw 'No token saved!';
  }

  return dispatch => {
    dispatch(changePasswordRequest());

    return fetchWithAuth(`${API_BASE_URI}/account/change-password`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          switch (response.status) {
            case 400:
              dispatch(changePasswordFailure(body));
              return true;
            case 401:
            // NOTE: should not happen as we should check if the token is valid before making the request
            default:
              return Promise.reject('Failed to change password');
          }
        }
        fetchWithCookie(`${API_BASE_URI}/refresh`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        })
          .then(resp => resp.json())
          .then(json => {
            localStorage.setItem(ID_TOKEN_KEY, json.token);
          });
        dispatch(changePasswordSuccess());
        return true;
      })
      .catch(err => {
        const apiError = {
          message: err,
          details: {},
        };
        dispatch(changePasswordFailure(apiError));
      });
  };
}
