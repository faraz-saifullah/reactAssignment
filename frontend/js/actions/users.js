import { getApiBaseUrl, ID_TOKEN_KEY } from '../const';
import { setLocale, I18n } from 'react-redux-i18n';

import Cookie from 'js-cookie';
import { fetchWithCookie, getRandomNumber } from '../utils';

const API_BASE_URI = getApiBaseUrl();
export const GET_USERS_REQUEST = 'GET_USERS_REQUEST';
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
export const GET_USERS_FAILURE = 'GET_USERS_FAILURE';
export const GET_SETTING_REQUEST = 'GET_SETTING_REQUEST';
export const GET_SETTING_SUCCESS = 'GET_SETTING_SUCCESS';
export const GET_SETTING_FAILURE = 'GET_SETTING_FAILURE';

function getSettingRequest() {
  return {
    type: GET_SETTING_REQUEST,
  };
}

function getSettingSuccess(setting) {
  return {
    type: GET_SETTING_SUCCESS,
    setting,
  };
}

function getSettingFailure(message) {
  return {
    type: GET_SETTING_FAILURE,
    message,
  };
}

export function getSetting() {
  let config = {};

  config = {
    method: 'GET',
  };
  return dispatch => {
    dispatch(getSettingRequest());
    return fetchWithCookie(`${API_BASE_URI}/app/settings`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(getSettingFailure(`Failed to get users. ${body.error}`));
          return Promise.reject(body.error);
        }
        dispatch(getSettingSuccess(body));

        if (!Cookie.get('lang')) {
          dispatch(setLocale(body.lang));
        }
        document.title = I18n.t('pagetitle');
        let link =
          document.querySelector("link[rel*='icon']") ||
          document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = `${body.faviconURL}?v=${getRandomNumber()}`;
        document.getElementsByTagName('head')[0].appendChild(link);
        return true;
      })
      .catch(err => {
        dispatch(getSettingFailure(`Failed to get users. ${err}`));
        console.log('Error: ', err);
      });
  };
}

function getUsersRequest() {
  return {
    type: GET_USERS_REQUEST,
  };
}

function getUsersError(message) {
  return {
    type: GET_USERS_FAILURE,
    message,
  };
}

function getUsersSuccess(users) {
  return {
    type: GET_USERS_SUCCESS,
    users,
  };
}

export function fetchUsers() {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {};

  if (token && token !== 'undefined') {
    config = {
      headers: { Authorization: `${token}` },
    };
  } else {
    throw 'No token saved!';
  }

  return dispatch => {
    dispatch(getUsersRequest());
    return fetchWithCookie(`${API_BASE_URI}/manage/users`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(getUsersError(`Failed to get users. ${body.error}`));
          return Promise.reject(body.error);
        }
        dispatch(getUsersSuccess(body));
        return true;
      })
      .catch(err => {
        dispatch(getUsersError(`Failed to get users. ${err}`));
        console.log('Error: ', err);
      });
  };
}

export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';

function updateUserRequest() {
  return {
    type: UPDATE_USER_REQUEST,
  };
}

function updateUserError(message) {
  return {
    type: UPDATE_USER_FAILURE,
    message,
  };
}

function updateUserSuccess(users) {
  return {
    type: UPDATE_USER_SUCCESS,
    users,
  };
}

export function updateUser(user) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {};

  if (token && token !== 'undefined') {
    config = {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(user),
    };
  } else {
    throw 'No token saved!';
  }

  return dispatch => {
    dispatch(updateUserRequest());
    return fetchWithCookie(`${API_BASE_URI}/manage/user`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(updateUserError(`Failed to update user. ${body.error}`));
          return Promise.reject('Failed to update user');
        }
        dispatch(updateUserSuccess(body));
      })
      .catch(err => {
        dispatch(updateUserError(`Failed to update user. ${body.error}`));
        console.log('Error: ', err);
      });
  };
}

export const DELETE_USERS_REQUEST = 'DELETE_USERS_REQUEST';
export const DELETE_USERS_SUCCESS = 'DELETE_USERS_SUCCESS';
export const DELETE_USERS_FAILURE = 'DELETE_USERS_FAILURE';

function deleteUsersRequest() {
  return {
    type: DELETE_USERS_REQUEST,
  };
}

function deleteUsersError(message) {
  return {
    type: DELETE_USERS_FAILURE,
    message,
  };
}

function deleteUsersSuccess(users) {
  return {
    type: DELETE_USERS_SUCCESS,
    users,
  };
}

export function deleteUsers(userIds) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {};

  if (token && token !== 'undefined') {
    config = {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify(userIds),
    };
  } else {
    throw 'No token saved!';
  }

  return dispatch => {
    dispatch(deleteUsersRequest());
    return fetchWithCookie(`${API_BASE_URI}/admin/user`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(deleteUsersError(`Failed to delete user. ${body.error}`));
          return Promise.reject('Failed to update user');
        }
        dispatch(deleteUsersSuccess(body));
      })
      .catch(err => {
        dispatch(deleteUsersError(`Failed to delete user. ${err}`));
        console.log('Error: ', err);
      });
  };
}
