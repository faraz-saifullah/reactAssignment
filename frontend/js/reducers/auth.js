import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
  CLEAR_LOGIN_ERRORS,
  SET_ROLE,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_RESET,
  SET_ACTIVE_TAB,
  ACCOUNT_NOT_VERIFIED,
  RESENT_EMAIL_SUCCESS,
  RESENT_EMAIL_NOTIFIED,
} from '../actions/auth';

import { ID_TOKEN_KEY } from '../const';

export function auth(
  state = {
    isFetchingCreds: false,
    isAuthenticated: !!localStorage.getItem(ID_TOKEN_KEY),
    role: 'ROLE_NONE',
    loggedInUser: '',
    resetPassword: {
      codeSent: false,
      confirmed: false,
      isConfirming: false,
      isSendingCode: false,
      errorMessage: '',
      resetString: '',
    },
    loginErrorMessage: '',
    registerErrorMessage: '',
    activeTab: {
      name: 'Login',
      isActive: true,
    },
    accountNotVerified: false,
    resentEmail: false,
  },
  action
) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetchingCreds: true,
        isAuthenticated: false,
        accountNotVerified: false,
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetchingCreds: false,
        isAuthenticated: true,
        role: action.role,
        loginErrorMessage: '',
        loggedInUser: action.username,
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetchingCreds: false,
        isAuthenticated: false,
        loginErrorMessage: action.message,
      });
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetchingCreds: false,
        isAuthenticated: false,
        role: 'ROLE_NONE',
        loggedInUser: '',
      });
    case CLEAR_LOGIN_ERRORS:
      return Object.assign({}, state, {
        loginErrorMessage: '',
        accountNotVerified: false,
      });
    case SET_ROLE:
      return Object.assign({}, state, {
        isAuthenticated: true,
        role: action.role,
      });
    case FORGOT_PASSWORD_REQUEST:
      return Object.assign({}, state, {
        resetPassword: {
          codeSent: false,
          resetString: '',
          confirmed: false,
          isConfirming: false,
          isSendingCode: false,
          error: '',
        },
      });
    case FORGOT_PASSWORD_SUCCESS:
      return Object.assign({}, state, {
        resetPassword: {
          codeSent: action.sent,
          resetString: '',
          confirmed: false,
          isConfirming: false,
          isSendingCode: false,
          errorMessage: '',
          email: action.email,
        },
      });
    case FORGOT_PASSWORD_FAILURE:
      return Object.assign({}, state, {
        resetPassword: {
          codeSent: false,
          resetString: '',
          confirmed: false,
          isConfirming: false,
          isSendingCode: false,
          errorMessage: action.message,
        },
      });
    case RESET_PASSWORD_REQUEST:
      return Object.assign({}, state, {
        resetPassword: {
          codeSent: true,
          confirmed: false,
          isConfirming: true,
          isSendingCode: false,
          errorMessage: '',
        },
      });
    case RESET_PASSWORD_SUCCESS:
      return Object.assign({}, state, {
        resetPassword: {
          codeSent: true,
          confirmed: true,
          resetString: '',
          isConfirming: false,
          isSendingCode: false,
          errorMessage: '',
        },
      });
    case RESET_PASSWORD_FAILURE:
      return Object.assign({}, state, {
        resetPassword: {
          codeSent: true,
          confirmed: false,
          isConfirming: false,
          isSendingCode: false,
          errorMessage: action.message,
        },
      });
    case RESET_PASSWORD_RESET:
      return Object.assign({}, state, {
        resetPassword: {
          codeSent: false,
          confirmed: false,
          isConfirming: false,
          isSendingCode: false,
          errorMessage: '',
          resetString: '',
        },
      });
    case ACCOUNT_NOT_VERIFIED:
      return Object.assign({}, state, {
        accountNotVerified: true,
      });
    case RESENT_EMAIL_SUCCESS:
      return Object.assign({}, state, {
        resentEmail: true,
      });
    case RESENT_EMAIL_NOTIFIED:
      return Object.assign({}, state, {
        resentEmail: false,
      });
    case SET_ACTIVE_TAB:
      return Object.assign({}, state, {
        activeTab: action.tab,
        loginErrorMessage: '',
        registerErrorMessage: '',
        accountNotVerified: false,
        resentEmail: false,
      });
    default:
      return state;
  }
}
