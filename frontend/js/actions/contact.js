import { getApiBaseUrl, ID_TOKEN_KEY } from '../const';
import { fetchWithAuth } from '../utils';

const API_BASE_URI = getApiBaseUrl();
export const CONTACT_US_REQUEST = 'CONTACT_US_REQUEST';
export const CONTACT_US_SUCCESS = 'CONTACT_US_SUCCESS';
export const CONTACT_US_FAILURE = 'CONTACT_US_FAILURE';

export const CONTACT_US_RESET = 'CONTACT_US_RESET';

function contactUsRequest() {
  return {
    type: CONTACT_US_REQUEST,
  };
}

function contactUsSuccess(sent) {
  return {
    type: CONTACT_US_SUCCESS,
    sent,
  };
}

export function contactUsFailure(message) {
  return {
    type: CONTACT_US_FAILURE,
    message,
  };
}

export function contactUs(text) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {};
  if (token && token !== 'undefined') {
    config = {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ text }),
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
    dispatch(contactUsRequest());

    return fetchWithAuth(`${API_BASE_URI}/app/contact-us`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          switch (response.status) {
            case 400:
              dispatch(contactUsFailure(body));
              return true;
            case 401:
            //NOTE: should not happen as we should check if the token is valid before making the request
            default:
              return Promise.reject('Failed to send contact us');
          }
        }
        //the sent field in body should be true at this point
        dispatch(contactUsSuccess(body.sent));
        return true;
      })
      .catch(err => {
        const apiError = {
          message: err,
          details: {},
        };
        dispatch(contactUsFailure(apiError));
      });
  };
}

function contactUsReset() {
  return {
    type: CONTACT_US_RESET,
  };
}

export function resetContactUs() {
  return dispatch => {
    dispatch(contactUsReset());
  };
}
