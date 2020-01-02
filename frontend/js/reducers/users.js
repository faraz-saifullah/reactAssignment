/* eslint-disable no-case-declarations */
import {
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  DELETE_USERS_REQUEST,
  DELETE_USERS_SUCCESS,
  DELETE_USERS_FAILURE,
  GET_SETTING_REQUEST,
  GET_SETTING_SUCCESS,
  GET_SETTING_FAILURE,
} from '../actions/users';
import { getRandomNumber } from '../utils';

export function users(
  state = {
    isFetchingUsers: false,
    usersArr: undefined,
    usersErrorMessage: undefined,
    setting: {
      currency: 'USD',
      features: {
        hideProfitsForUsers: false,
      },
    },
    isFetchingSetting: false,
  },
  action
) {
  switch (action.type) {
    case GET_SETTING_REQUEST:
      return Object.assign({}, state, {
        isFetchingSetting: true,
      });
    case GET_SETTING_SUCCESS:
      const setting = {
        ...action.setting,
        appLogoURL: `${action.setting.appLogoURL}?v=${getRandomNumber()}`,
        emailLogoURL: `${action.setting.emailLogoURL}?v=${getRandomNumber()}`,
        faviconURL: `${action.setting.faviconURL}?v=${getRandomNumber()}`,
      };
      return Object.assign({}, state, {
        setting,
        isFetchingSetting: false,
      });
    case GET_SETTING_FAILURE:
      return Object.assign({}, state, {
        isFetchingSetting: false,
      });
    case GET_USERS_REQUEST:
      return Object.assign({}, state, {
        isFetchingUsers: true,
      });
    case GET_USERS_SUCCESS:
      return Object.assign({}, state, {
        isFetchingUsers: false,
        usersArr: action.users,
        usersErrorMessage: undefined,
      });
    case GET_USERS_FAILURE:
      return Object.assign({}, state, {
        isFetchingUsers: false,
        usersErrorMessage: action.message,
      });
    case UPDATE_USER_REQUEST:
      return Object.assign({}, state, {
        isFetchingUsers: true,
      });
    case UPDATE_USER_SUCCESS:
      return Object.assign({}, state, {
        isFetchingUsers: false,
        usersArr: action.users,
        usersErrorMessage: undefined,
      });
    case UPDATE_USER_FAILURE:
      return Object.assign({}, state, {
        isFetchingUsers: false,
        usersErrorMessage: action.message,
      });
    case DELETE_USERS_REQUEST:
      return Object.assign({}, state, {
        isFetchingUsers: true,
      });
    case DELETE_USERS_SUCCESS:
      return Object.assign({}, state, {
        isFetchingUsers: false,
        usersArr: action.users,
        usersErrorMessage: undefined,
      });
    case DELETE_USERS_FAILURE:
      return Object.assign({}, state, {
        isFetchingUsers: false,
        usersErrorMessage: action.message,
      });
    default:
      return state;
  }
}
