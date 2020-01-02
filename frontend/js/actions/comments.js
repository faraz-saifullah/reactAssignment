import { getApiBaseUrl, ID_TOKEN_KEY } from '../const';
import { fetchWithAuth } from '../utils';

/**
 * Add a eomment to an existing idea (async)
 */
const API_BASE_URI = getApiBaseUrl();
export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

function addCommentRequest() {
  return {
    type: ADD_COMMENT_REQUEST,
  };
}

function addCommentError(message) {
  return {
    type: ADD_COMMENT_FAILURE,
    message,
  };
}

/**
 * @param {*} idea
 *  The updated idea with the added comment that is returned by the backend
 *
 *
 */
function addCommentSuccess(idea, anonymousMode) {
  const newIdea = Object.assign({}, idea, { anonymousMode });
  return {
    type: ADD_COMMENT_SUCCESS,
    idea: newIdea,
  };
}

export function handleAddCommentError(message) {
  return dispatch => {
    dispatch(addCommentError(message));
  };
}

/**
 *
 * @param {*} index
 *  index of current action
 *  It is not the id of the action but index in the array of results in screen
 * @param {*} comment
 *
 *  private Long ideaId;
    private String text;
    private String submittedBy;
    private Long submittedAt;"
 *
 *
 */
export function addComment(comment) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {};

  if (token && token !== 'undefined') {
    config = {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(comment),
    };
  } else {
    throw 'No token saved!';
  }
  const anonymousMode = comment.anonymous;
  return dispatch => {
    dispatch(addCommentRequest());
    return fetchWithAuth(`${API_BASE_URI}/ideas/comment`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(addCommentError(`${body.error}`)); // failed to add comment
          return Promise.reject('Failed to add comment');
        }
        // body is the returned idea from backend
        dispatch(addCommentSuccess(body, anonymousMode));
        return true;
      })
      .catch(err => {
        dispatch(addCommentError(`${err}`));
      });
  };
}

export const ADD_REPLY_REQUEST = 'ADD_REPLY_REQUEST';
export const ADD_REPLY_SUCCESS = 'ADD_REPLY_SUCCESS';
export const ADD_REPLY_FAILURE = 'ADD_REPLY_FAILURE';

function addReplyRequest() {
  return {
    type: ADD_REPLY_REQUEST,
  };
}

function addReplySuccess(idea) {
  return {
    type: ADD_REPLY_SUCCESS,
    idea,
  };
}

function addReplyFailure(message) {
  return {
    type: ADD_REPLY_FAILURE,
    message,
  };
}

export function replyComment(reply) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {};
  if (token && token !== 'undefined') {
    config = {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(reply),
    };
  } else {
    throw 'No token saved!';
  }
  const anonymousMode = reply.anonymous;
  return dispatch => {
    dispatch(addReplyRequest());
    return fetchWithAuth(`${API_BASE_URI}/ideas/comment/reply`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(addReplyFailure(`${body.error}`)); // failed to add comment
          return Promise.reject('Failed to add reply');
        }
        // body is the returned idea from backend
        dispatch(addReplySuccess(body, anonymousMode));
        return true;
      })
      .catch(err => {
        dispatch(addReplyFailure(`${err}`));
      });
  };
}

export const TOGGLE_ANONYMOUS = 'TOGGLE_ANONYMOUS';

export function toggleAnonymous(ideaId) {
  return {
    type: TOGGLE_ANONYMOUS,
    ideaId,
  };
}

export const UPDATE_COMMENT_ATTACHMENTS = 'UPDATE_COMMENT_ATTACHMENTS';

export function updateCommentAttachments(ideaId) {
  return {
    type: UPDATE_COMMENT_ATTACHMENTS,
    ideaId,
  };
}
