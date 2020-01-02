import { I18n } from 'react-redux-i18n';
import { toast } from 'react-toastify';
import { getApiBaseUrl, ID_TOKEN_KEY } from '../const';
import { fetchWithAuth } from '../utils';
import { getSetting } from './users';

const queryString = require('query-string');

const API_BASE_URI = getApiBaseUrl();
export const GET_INVITE_LINK_REQUEST = 'GET_INVITE_LINK_REQUEST';
export const GET_INVITE_LINK_SUCCESS = 'GET_INVITE_LINK_SUCCESS';
export const GET_INVITE_LINK_FAILURE = 'GET_INVITE_LINK_FAILURE';

function get_link_request() {
  return {
    type: GET_INVITE_LINK_REQUEST,
  };
}

function get_link_success(body) {
  return {
    type: GET_INVITE_LINK_SUCCESS,
    body,
  };
}

function get_link_failure(message) {
  return {
    type: GET_INVITE_LINK_FAILURE,
    message,
  };
}

export function get_invite_link() {
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
    dispatch(get_link_request());

    const url = `${API_BASE_URI}/admin/wildcard-invite-link`;
    return fetchWithAuth(url, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(get_link_failure(body.message));
          return Promise.reject(body.message);
        }

        dispatch(get_link_success(body));
        return true;
      })
      .catch(err => {
        dispatch(get_link_failure(err.message));
      });
  };
}

export const GEN_LINK_REQUEST = 'GEN_LINK_REQUEST';
export const GEN_LINK_SUCCESS = 'GEN_LINK_SUCCESS';
export const GEN_LINK_FAILURE = 'GEN_LINK_FAILURE';

function gen_link_request() {
  return {
    type: GEN_LINK_REQUEST,
  };
}

function gen_link_success(body) {
  return {
    type: GEN_LINK_SUCCESS,
    body,
  };
}

function gen_link_failure(message) {
  return {
    type: GEN_LINK_FAILURE,
    message,
  };
}

export function gen_link(mode) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {
    method: 'POST',
  };

  if (token && token !== 'undefined') {
    config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        mode,
      }),
    };
  } else {
    throw 'No token saved!';
  }

  return dispatch => {
    dispatch(gen_link_request());

    const url = `${API_BASE_URI}/admin/wildcard-invite-link`;
    return fetchWithAuth(url, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(gen_link_failure(body.message));
          return Promise.reject(body.message);
        }

        dispatch(gen_link_success(body));
        return true;
      })
      .catch(err => {
        dispatch(gen_link_failure(err.message));
      });
  };
}

export const SEND_INVITE_EMAIL_REQUEST = 'SEND_INVITE_EMAIL_REQUEST';
export const SEND_INVITE_EMAIL_SUCCESS = 'SEND_INVITE_EMAIL_SUCCESS';
export const SEND_INVITE_EMAIL_FAILURE = 'SEND_INVITE_EMAIL_FAILURE';

function send_invite_email_request() {
  return {
    type: SEND_INVITE_EMAIL_REQUEST,
  };
}

function send_invite_email_success(body) {
  return {
    type: SEND_INVITE_EMAIL_SUCCESS,
    body,
  };
}

function send_invite_email_failure(message) {
  return {
    type: SEND_INVITE_EMAIL_FAILURE,
    message,
  };
}

export function send_invite_email(emailList) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {
    method: 'POST',
  };

  if (token && token !== 'undefined') {
    config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        users: emailList,
        sent: true,
      }),
    };
  } else {
    throw 'No token saved!';
  }

  return dispatch => {
    dispatch(gen_link_request());

    const url = `${API_BASE_URI}/admin/invite-users`;
    return fetchWithAuth(url, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(send_invite_email_failure(body.message));
          return Promise.reject(body.message);
        }

        dispatch(send_invite_email_success(body));
        dispatch(getInvitedUsers(10, 0));
        if (body.sentInvitations.length) {
          toast.info(I18n.t('console.add_member.send_email_success'));
        }
        return true;
      })
      .catch(err => {
        dispatch(send_invite_email_failure(err.message));
        toast.error(I18n.t('console.add_member.send_email_error'));
      });
  };
}

export const GET_DOMAIN_REQUEST = 'GET_DOMAIN_REQUEST';
export const GET_DOMAIN_SUCCESS = 'GET_DOMAIN_SUCCESS';
export const GET_DOMAIN_FAILURE = 'GET_DOMAIN_FAILURE';

function getDomainRequest() {
  return {
    type: GET_DOMAIN_REQUEST,
  };
}

function getDomainSuccess(body) {
  return {
    type: GET_DOMAIN_SUCCESS,
    body,
  };
}

function getDomainFailure(message) {
  return {
    type: GET_DOMAIN_FAILURE,
    message,
  };
}

export function getDomains() {
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
    dispatch(getDomainRequest());

    const url = `${API_BASE_URI}/admin/domains`;
    return fetchWithAuth(url, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(getDomainFailure(body.message));
          return Promise.reject(body.message);
        }

        dispatch(getDomainSuccess(body));
        return true;
      })
      .catch(err => {
        dispatch(getDomainFailure(err.message));
      });
  };
}

export const ADD_DOMAIN_REQUEST = 'ADD_DOMAIN_REQUEST';
export const ADD_DOMAIN_SUCCESS = 'ADD_DOMAIN_SUCCESS';
export const ADD_DOMAIN_FAILURE = 'ADD_DOMAIN_FAILURE';

function addDomainRequest() {
  return {
    type: ADD_DOMAIN_REQUEST,
  };
}

function addDomainSuccess(body) {
  return {
    type: ADD_DOMAIN_SUCCESS,
    body,
  };
}

function addDomainFailure(message) {
  return {
    type: ADD_DOMAIN_FAILURE,
    message,
  };
}

export function addDomain(domainString) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {
    method: 'POST',
  };

  if (token && token !== 'undefined') {
    config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        id: 0,
        name: domainString,
      }),
    };
  } else {
    throw 'No token saved!';
  }

  return dispatch => {
    dispatch(addDomainRequest());

    const url = `${API_BASE_URI}/admin/domains`;
    return fetchWithAuth(url, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(addDomainFailure(body.message));
          return Promise.reject(body.message);
        }

        dispatch(addDomainSuccess(body));
        return true;
      })
      .catch(err => {
        dispatch(addDomainFailure(err.message));
        toast.error(I18n.t('console.add_member.domain_address_added_error'));
      });
  };
}

export const DELETE_DOMAIN_REQUEST = 'DELETE_DOMAIN_REQUEST';
export const DELETE_DOMAIN_SUCCESS = 'DELETE_DOMAIN_SUCCESS';
export const DELETE_DOMAIN_FAILURE = 'DELETE_DOMAIN_FAILURE';

function deleteDomainRequest() {
  return {
    type: DELETE_DOMAIN_REQUEST,
  };
}

function deleteDomainSuccess(body) {
  return {
    type: DELETE_DOMAIN_SUCCESS,
    body,
  };
}

function deleteDomainFailure(message) {
  return {
    type: DELETE_DOMAIN_FAILURE,
    message,
  };
}

export function deleteDomain(domain) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {
    method: 'DELETE',
  };

  if (token && token !== 'undefined') {
    config = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(domain),
    };
  } else {
    throw 'No token saved!';
  }

  return dispatch => {
    dispatch(deleteDomainRequest());

    const url = `${API_BASE_URI}/admin/domains`;
    return fetchWithAuth(url, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(deleteDomainFailure(body.message));
          return Promise.reject(body.message);
        }

        dispatch(deleteDomainSuccess(body));
        return true;
      })
      .catch(err => {
        dispatch(deleteDomainFailure(err.message));
      });
  };
}

export const GET_INVITED_USER_REQUEST = 'GET_INVITED_USER_REQUEST';
export const GET_INVITED_USER_SUCCESS = 'GET_INVITED_USER_SUCCESS';
export const GET_INVITED_USER_FAILURE = 'GET_INVITED_USER_FAILURE';

function getInvitedUserRequest() {
  return {
    type: GET_INVITED_USER_REQUEST,
  };
}

function getInvitedUserSuccess(body) {
  return {
    type: GET_INVITED_USER_SUCCESS,
    body,
  };
}

function getInvitedUserFailure(message) {
  return {
    type: GET_INVITED_USER_FAILURE,
    message,
  };
}

export function getInvitedUsers(size, page, sort, search) {
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
    dispatch(getInvitedUserRequest());
    const params = { size, page };
    if (sort) {
      params.sort = sort;
    }
    if (search) {
      params.search = search;
    }

    const url = `${API_BASE_URI}/manage/invites?${queryString.stringify(
      params
    )}`;

    return fetchWithAuth(url, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(getInvitedUserFailure(body.message));
          return Promise.reject(body.message);
        }

        dispatch(getInvitedUserSuccess(body));
        return true;
      })
      .catch(err => {
        dispatch(getInvitedUserFailure(err.message));
      });
  };
}

export const RESEND_INVITE_REQUEST = 'RESEND_INVITE_REQUEST';
export const RESEND_INVITE_SUCCESS = 'RESEND_INVITE_SUCCESS';
export const RESEND_INVITE_FAILURE = 'RESEND_INVITE_FAILURE';

function resendInviteRequest() {
  return {
    type: RESEND_INVITE_REQUEST,
  };
}

function resendInviteSuccess(body) {
  return {
    type: RESEND_INVITE_SUCCESS,
    body,
  };
}

function resendInviteFailure(message) {
  return {
    type: RESEND_INVITE_FAILURE,
    message,
  };
}

export function resendInvite(invite) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {
    method: 'POST',
  };

  if (token && token !== 'undefined') {
    config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(invite),
    };
  } else {
    throw 'No token saved!';
  }

  return dispatch => {
    dispatch(resendInviteRequest());

    const url = `${API_BASE_URI}/manage/invites`;
    return fetchWithAuth(url, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(resendInviteFailure(body.message));
          return Promise.reject(body.message);
        }

        dispatch(resendInviteSuccess(body));
        return true;
      })
      .catch(err => {
        dispatch(resendInviteFailure(err.message));
      });
  };
}

export const DELETE_INVITE_REQUEST = 'DELETE_INVITE_REQUEST';
export const DELETE_INVITE_SUCCESS = 'DELETE_INVITE_SUCCESS';
export const DELETE_INVITE_FAILURE = 'DELETE_INVITE_FAILURE';

function deleteInviteRequest() {
  return {
    type: DELETE_INVITE_REQUEST,
  };
}

function deleteInviteSuccess(body) {
  return {
    type: DELETE_INVITE_SUCCESS,
    body,
  };
}

function deleteInviteFailure(message) {
  return {
    type: DELETE_INVITE_FAILURE,
    message,
  };
}

export function deleteInvite(invite, size, page, sort, search) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {
    method: 'DELETE',
  };

  if (token && token !== 'undefined') {
    config = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(invite),
    };
  } else {
    throw 'No token saved!';
  }

  return dispatch => {
    dispatch(deleteInviteRequest());

    const params = { size, page };
    if (sort) {
      params.sort = sort;
    }
    if (search) {
      params.search = search;
    }
    const url = `${API_BASE_URI}/manage/invites?${queryString.stringify(
      params
    )}`;
    return fetchWithAuth(url, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(deleteInviteFailure(body.message));
          return Promise.reject(body.message);
        }

        dispatch(deleteInviteSuccess(body));
        return true;
      })
      .catch(err => {
        dispatch(deleteInviteFailure(err.message));
      });
  };
}

export const GET_MEMBER_REQUEST = 'GET_MEMBER_REQUEST';
export const GET_MEMBER_SUCCESS = 'GET_MEMBER_SUCCESS';
export const GET_MEMBER_FAILURE = 'GET_MEMBER_FAILURE';

function getMemberRequest() {
  return {
    type: GET_MEMBER_REQUEST,
  };
}

function getMemberSuccess(body) {
  return {
    type: GET_MEMBER_SUCCESS,
    body,
  };
}

function getMemberFailure(message) {
  return {
    type: GET_MEMBER_FAILURE,
    message,
  };
}

export function getMemberCount() {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {
    method: 'GET',
  };

  if (token && token !== 'undefined') {
    config = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    };
  } else {
    throw 'No token saved!';
  }

  return dispatch => {
    dispatch(getMemberRequest());

    const url = `${API_BASE_URI}/members/count`;
    return fetchWithAuth(url, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(getMemberFailure(body.message));
          return Promise.reject(body.message);
        }
        dispatch(getMemberSuccess(body));
        return true;
      })
      .catch(err => {
        dispatch(getMemberFailure(err.message));
      });
  };
}

export const GET_USER_REQUEST = 'GET_USER_REQUEST';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAILURE = 'GET_USER_FAILURE';

function getUserRequest() {
  return {
    type: GET_USER_REQUEST,
  };
}

function getUserSuccess(body) {
  return {
    type: GET_USER_SUCCESS,
    body,
  };
}

function getUserFailure(message) {
  return {
    type: GET_USER_FAILURE,
    message,
  };
}

export function getUsers(size, page, search) {
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
    dispatch(getUserRequest());

    let params = { size, page };
    if (search !== undefined) {
      params.search = search;
    }
    const url = `${API_BASE_URI}/manage/users?${queryString.stringify(params)}`;

    return fetchWithAuth(url, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(getUserFailure(body.message));
          return Promise.reject(body.message);
        }
        dispatch(getUserSuccess(body));
        dispatch(getMemberCount());
        return true;
      })
      .catch(err => {
        dispatch(getUserFailure(err.message));
      });
  };
}

export const GET_ROLES_SUCCESS = 'GET_ROLES_SUCCESS';

function getRolesSuccess(roles) {
  return {
    type: GET_ROLES_SUCCESS,
    roles,
  };
}

export function getRoles() {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {};
  if (token && token !== 'undefined') {
    config = {
      headers: {
        Authorization: `${token}`,
      },
      method: 'GET',
    };
  } else {
    throw 'No token saved!';
  }
  return dispatch =>
    fetchWithAuth(`${API_BASE_URI}/roles`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          return Promise.reject(body.message);
        }
        dispatch(getRolesSuccess(body));
        return true;
      })
      .catch(err => {
        return err;
      });
}

export const UPDATE_USER_ROLE_FAILURE = 'UPDATE_USER_ROLE_FAILURE';
export const UPDATE_USER_ROLE_SUCCESS = 'UPDATE_USER_ROLE_SUCCESS';
export const UPDATE_USER_ROLE_REQUEST = 'UPDATE_USER_ROLE_REQUEST';

function updateUserRoleFailure(message) {
  return {
    type: UPDATE_USER_ROLE_FAILURE,
    message,
  };
}

export function updateRole(user_object, size, page) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {};
  if (token && token !== 'undefined') {
    config = {
      headers: {
        Authorization: `${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(user_object),
      method: 'POST',
    };
  } else {
    throw 'No token saved!';
  }
  return dispatch =>
    fetchWithAuth(`${API_BASE_URI}/manage/users`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(updateUserRoleFailure(body.message));
          return Promise.reject(body.message);
        }
        dispatch(getUsers(size, page));
        dispatch(getMemberCount());
      })
      .catch(err => {
        dispatch(updateUserRoleFailure(err.message));
      });
}

export const DELETE_USER_REQUEST = 'DELETE_USER_REQUEST';
export const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';

function deleteUserRequest() {
  return {
    type: DELETE_USER_REQUEST,
  };
}

function deleteUserFailure(message) {
  return {
    type: DELETE_USER_FAILURE,
    message,
  };
}

export function deleteUsers(users, size, page) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {
    method: 'DELETE',
  };

  if (token && token !== 'undefined') {
    config = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(users),
    };
  } else {
    throw 'No token saved!';
  }

  return dispatch => {
    dispatch(deleteUserRequest());
    const url = `${API_BASE_URI}/manage/users`;
    return fetchWithAuth(url, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(deleteUserFailure(body.message));
          return Promise.reject(body.message);
        }
        dispatch(getUsers(size, page));
        dispatch(getMemberCount());
      })
      .catch(err => {
        dispatch(deleteUserFailure(err.message));
      });
  };
}

export const UPDATE_PAGE_TITLE_SUCCESS = 'UPDATE_PAGE_TITLE_SUCCESS';

export function uploadAppLogo(data, file_path) {
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
    throw 'No token saved!';
  }
  return dispatch =>
    fetchWithAuth(`${API_BASE_URI}/admin/corporate/app-logo`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          return Promise.reject(body.message);
        }
        dispatch(getSetting());
        return true;
      })
      .catch(err => {
        return err;
      });
}

export function uploadEmailLogo(data, file_path) {
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
    throw 'No token saved!';
  }

  return dispatch => {
    const url = `${API_BASE_URI}/admin/corporate/email-logo`;
    return fetchWithAuth(url, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          return Promise.reject(body.message);
        }
        dispatch(getSetting());
        return true;
      })
      .catch(err => err);
  };
}

export function uploadFaviconLogo(data, file_path) {
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
    throw 'No token saved!';
  }

  return dispatch => {
    const url = `${API_BASE_URI}/admin/corporate/favicon`;
    return fetchWithAuth(url, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          return Promise.reject(body.message);
        }
        dispatch(getSetting());

        return true;
      })
      .catch(err => err);
  };
}

export function updatePageTitleSuccess(title) {
  return {
    type: UPDATE_PAGE_TITLE_SUCCESS,
    title,
  };
}

export function updateColor(color_object) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {};
  if (token && token !== 'undefined') {
    config = {
      headers: {
        Authorization: `${token}`,
        'content-type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ ...color_object }),
    };
  } else {
    throw 'No token saved!';
  }
  return dispatch => {
    const url = `${API_BASE_URI}/admin/corporate/colors`;
    return fetchWithAuth(url, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          return Promise.reject(body.message);
        }
        dispatch(getSetting());
        return true;
      })
      .catch(err => err);
  };
}

export function updateCurrency(currencyCode) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {};
  if (token && token !== 'undefined') {
    config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      method: 'POST',
      body: JSON.stringify(currencyCode),
    };
  } else {
    throw 'No token saved!';
  }

  return dispatch => {
    const url = `${API_BASE_URI}/admin/corporate/currency`;
    return fetchWithAuth(url, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          return Promise.reject(body.message);
        }
        dispatch(getSetting());

        return true;
      })
      .catch(err => err);
  };
}
