import { getApiBaseUrl, ID_TOKEN_KEY } from '../const';
import { fetchWithAuth } from '../utils';
import history from './../history';

const queryString = require('query-string');

const API_BASE_URI = getApiBaseUrl();
export const GET_IDEAS_REQUEST = 'GET_IDEAS_REQUEST';
export const GET_IDEAS_SUCCESS = 'GET_IDEAS_SUCCESS';
export const GET_IDEAS_FAILURE = 'GET_IDEAS_FAILURE';
export const POST_IDEAS_REQUEST = 'POST_IDEAS_REQUEST';
export const POST_IDEAS_SUCCESS = 'POST_IDEAS_SUCCESS';
export const PSOT_IDEAS_FAILURE = 'POST_IDEAS_FAILURE';
export const GET_SUMMARY_REQUEST = 'GET_SUMMARY_REQUEST';
export const GET_SUMMARY_SUCCESS = 'GET_SUMMARY_SUCCESS';
export const GET_SUMMARY_FAILURE = 'GET_SUMMARY_FAILURE';
export const REMOVE_TEMP_FILE = 'REMOVE_TEMP_FILE';
export const SELECT_IDEA = 'SELECT_IDEA';

function selectIdea(idea) {
  return {
    type: SELECT_IDEA,
    idea,
  };
}

export function selectIdeaForView(idea) {
  return dispatch => {
    dispatch(selectIdea(idea));
  };
}

export const EDIT_IDEA = 'EDIT_IDEA';

function editIdea(idea) {
  return {
    type: EDIT_IDEA,
    idea,
  };
}

export function editIdeaFor(idea) {
  return dispatch => {
    dispatch(editIdea(idea));
  };
}

function removeTempFile() {
  return {
    type: REMOVE_TEMP_FILE,
  };
}

export function removeTemp() {
  return dispatch => {
    dispatch(removeTempFile());
  };
}

function getSummaryRequest() {
  return {
    type: GET_SUMMARY_REQUEST,
  };
}

function getSummarySuccess(summary) {
  return {
    type: GET_SUMMARY_SUCCESS,
    summary,
  };
}

function getSummaryFailure(message) {
  return {
    type: GET_SUMMARY_FAILURE,
    message,
  };
}

export function fetchSummary(
  submittedAtMsMin,
  submittedAtMsMax,
  votesMin,
  votesMax,
  profitMin,
  profitMax,
  implementationTimeMsMin,
  implementationTimeMsMax,
  tags,
  partialFullSwitch,
  costMin,
  costMax
) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;

  let config = {
    method: 'GET',
  };

  const query = {
    submittedAtMsMin,
    submittedAtMsMax,
    votesMin,
    votesMax,
    profitMin,
    profitMax,
    implementationTimeMsMin,
    implementationTimeMsMax,
    tags,
    partialFullSwitch,
    costMin,
    costMax,
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
    dispatch(getSummaryRequest());
    // console.log(config);
    const url = `${API_BASE_URI}/ideas/summary-ttm-profit-vote?${queryString.stringify(
      query
    )}`;

    return fetchWithAuth(url, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(getSummaryFailure(`Failed to get ideas. ${body.error}`));
          return Promise.reject(body.error);
        }

        dispatch(getSummarySuccess(body));
        return true;
      })
      .catch(err => {
        dispatch(getSummaryFailure(`Failed to get ideas. ${err}`));
        console.log('Error: ', err);
      });
  };
}

function getIdeasRequest() {
  return {
    type: GET_IDEAS_REQUEST,
  };
}

function getIdeasError(message) {
  return {
    type: GET_IDEAS_FAILURE,
    message,
  };
}

function getIdeasSuccess(ideas) {
  const newIdeas = ideas.content.map(idea => {
    idea.anonymousMode = false;
    return idea;
  });

  return {
    type: GET_IDEAS_SUCCESS,
    ideas: newIdeas,
    totalPages: ideas.totalPages,
    number: ideas.number,
    size: ideas.size,
  };
}

/**
 *
 * Get the ideas according to the filter
 *
 * @param {} filter
 *      Value entered on the sortby field (main filter is Newest or Top)
 * @param {*} stages
 *      Asked stages : Any Stage (default) / Incubation / Prototyping / Launched / Cancelled
 * @param {*} submittedAtMsMin
 *      Type of top filter Past Hour / Past Day / Past Week / Past Month / Past Year / All time
 * @param {*} submittedAtMsMax
 * @param {*} votesMin
 * @param {*} votesMax
 * @param {*} profitMin
 * @param {*} profitMax
 * @param {*} implementationTimeMsMin
 * @param {*} implementationTimeMsMax
 * @param {*} tags
 */
export function fetchIdeas(
  pageNum,
  myIdeasOnly,
  filter,
  submittedAtMsMin,
  submittedAtMsMax,
  votesMin,
  votesMax,
  profitMin,
  profitMax,
  implementationTimeMsMin,
  implementationTimeMsMax,
  tags,
  partialFullSwitch,
  costMin,
  costMax
) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;

  let config = {
    method: 'GET',
  };

  const query = {
    page: pageNum,
    myIdeasOnly,
    filter,
    submittedAtMsMin,
    submittedAtMsMax,
    votesMin,
    votesMax,
    profitMin,
    profitMax,
    implementationTimeMsMin,
    implementationTimeMsMax,
    tags,
    partialFullSwitch,
    costMin,
    costMax,
    size: 12,
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
    dispatch(getIdeasRequest());
    // console.log(config);
    const url = `${API_BASE_URI}/ideas?${queryString.stringify(query)}`;

    return fetchWithAuth(url, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(getIdeasError(`Failed to get ideas. ${body.error}`));
          return Promise.reject(body.error);
        }

        dispatch(getIdeasSuccess(body));
        return true;
      })
      .catch(err => {
        dispatch(getIdeasError(`Failed to get ideas. ${err}`));
        console.log('Error: ', err);
      });
  };
}

export const UPDATE_IDEA_REQUEST = 'UPDATE_IDEA_REQUEST';
export const UPDATE_IDEA_SUCCESS = 'UPDATE_IDEA_SUCCESS';
export const UPDATE_IDEA_FAILURE = 'UPDATE_IDEA_FAILURE';

function updateIdeaRequest() {
  return {
    type: UPDATE_IDEA_REQUEST,
  };
}

function updateIdeaError(message) {
  return {
    type: UPDATE_IDEA_FAILURE,
    message,
  };
}

function updateIdeaSuccess(updatedIdea, oldIdea, anonymousMode) {
  console.log('updateIdeaSuccess(...)');
  console.log('updatedIdea');
  console.log(updatedIdea);
  console.log('oldIdea');
  console.log(oldIdea);
  console.log(anonymousMode);
  const newIdea = Object.assign({}, oldIdea, updatedIdea, { anonymousMode });
  console.log('newIdea');
  console.log(newIdea);

  return {
    type: UPDATE_IDEA_SUCCESS,
    idea: newIdea,
  };
}

export function handleUpdateIdeaError(message) {
  return dispatch => {
    dispatch(updateIdeaError(message));
  };
}

export function updateIdea(idea) {
  console.log('updateIdea(idea) initial');
  console.log(idea);
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {};

  if (token && token !== 'undefined') {
    console.log('idea to post');
    console.log(idea);
    config = {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(idea),
    };
  } else {
    throw 'No token saved!';
  }
  return dispatch => {
    dispatch(updateIdeaRequest());
    console.log('updateIdea(idea)');
    console.log(idea);
    return fetchWithAuth(`${API_BASE_URI}/ideas`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(updateIdeaError(`Failed to update idea. ${body.error}`));
          return Promise.reject('Failed to update idea');
        }
        // TODO: Take anonymousMode from userSession property
        dispatch(updateIdeaSuccess(body, idea, idea.anonymousMode));
        return true;
      })
      .catch(err => {
        dispatch(updateIdeaError(`Failed to update user. ${err}`));
        console.log('Error: ', err);
      });
  };
}

export const DELETE_IDEAS_REQUEST = 'DELETE_IDEAS_REQUEST';
export const DELETE_IDEAS_SUCCESS = 'DELETE_IDEAS_SUCCESS';
export const DELETE_IDEAS_FAILURE = 'DELETE_IDEAS_FAILURE';

function deleteIdeasRequest() {
  return {
    type: DELETE_IDEAS_REQUEST,
  };
}

function deleteUsersError(message) {
  return {
    type: DELETE_IDEAS_FAILURE,
    message,
  };
}

function deleteUsersSuccess(ideas) {
  return {
    type: DELETE_IDEAS_SUCCESS,
    ideas,
  };
}

export function deleteIdeas(ideaIds) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {};

  if (token && token !== 'undefined') {
    config = {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify(ideaIds),
    };
  } else {
    throw 'No token saved!';
  }

  return dispatch => {
    dispatch(deleteIdeasRequest());
    return fetchWithAuth(`${API_BASE_URI}/ideas`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(deleteIdeasError(`Failed to delete idea. ${body.error}`));
          return Promise.reject('Failed to update idea');
        }
        dispatch(deleteIdeasSuccess(body));
      })
      .catch(err => {
        dispatch(deleteIdeasError(`Failed to delete idea. ${err}`));
        console.log('Error: ', err);
      });
  };
}

/**
 * Add a new idea async
 */

export const ADD_IDEA_REQUEST = 'ADD_IDEA_REQUEST';
export const ADD_IDEA_SUCCESS = 'ADD_IDEA_SUCCESS';
export const ADD_IDEA_FAILURE = 'ADD_IDEA_FAILURE';

function addIdeaRequest() {
  return {
    type: ADD_IDEA_REQUEST,
  };
}

function addIdeaError(message) {
  return {
    type: ADD_IDEA_FAILURE,
    message,
  };
}

function addIdeaSuccess(idea, anonymousMode) {
  const newIdea = Object.assign({}, idea, { anonymousMode });
  return {
    type: ADD_IDEA_SUCCESS,
    idea: newIdea,
  };
}

export function handleAddIdeaError(message) {
  return dispatch => {
    dispatch(addIdeaError(message));
  };
}

export function addIdea(idea, number, myIdea, filter) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {};

  if (token && token !== 'undefined') {
    config = {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(idea),
    };
  } else {
    throw 'No token saved!';
  }

  return dispatch => {
    dispatch(addIdeaRequest());
    return fetchWithAuth(`${API_BASE_URI}/ideas`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(addIdeaError(`Failed to add idea. ${body.error}`));
          return Promise.reject('Failed to add idea');
        }
        console.log('addIdea(...) -> body');
        console.log(body);
        dispatch(fetchIdeas(number, myIdea, filter));
        dispatch(addIdeaSuccess(body, idea.anonymousMode));
        history.push('/all-ideas');

        return true;
      })
      .catch(err => {
        dispatch(addIdeaError(`Failed to add idea. ${err}`));
        console.log('Error: ', err);
      });
  };
}

export const TOGGLE_FILTER_FULL_PARTIAL = 'TOGGLE_FILTER_FULL_PARTIAL';

export function toggleFilterFullPartial() {
  return {
    type: TOGGLE_FILTER_FULL_PARTIAL,
  };
}

export const TOGGLE_VOTE = 'TOGGLE_VOTE';

export function toggleVote(ideaId, refetch, myIdea, filter, number) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  let config = {};

  if (token && token !== 'undefined') {
    config = {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ ideaId }),
    };
  } else {
    throw 'No token saved!';
  }

  return dispatch => {
    dispatch(toggleVoteRequest());
    return fetchWithAuth(`${API_BASE_URI}/ideas/vote`, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(toggleVoteError(`Failed to toggle vote. ${body.error}`));
          return Promise.reject('Failed to toggle vote');
        }
        dispatch(toggleVoteSuccess(body));
        if (refetch != undefined && refetch == true) {
          dispatch(fetchIdeas(number, myIdea, filter));
        }
        return true;
      })
      .catch(err => {
        dispatch(toggleVoteError(`Failed to toggle vote. ${err}`));
        console.log('Error: ', err);
      });
  };
}

export const TOGGLE_VOTE_REQUEST = 'TOGGLE_VOTE_REQUEST';
export const TOGGLE_VOTE_SUCCESS = 'TOGGLE_VOTE_SUCCESS';
export const TOGGLE_VOTE_FAILURE = 'TOGGLE_VOTE_FAILURE';

function toggleVoteRequest() {
  return {
    type: TOGGLE_VOTE_REQUEST,
  };
}

function toggleVoteError(message) {
  return {
    type: TOGGLE_VOTE_FAILURE,
    message,
  };
}

function toggleVoteSuccess(idea) {
  const newIdea = Object.assign({}, idea, { anonymousMode: false });
  console.log(newIdea);

  return {
    type: TOGGLE_VOTE_SUCCESS,
    idea: newIdea,
  };
}

export const CHANGE_VOTES = 'CHANGE_VOTES';

export function changeVotes(votesMin, votesMax) {
  console.log('action.changeVotes(...)');
  console.log(votesMin);
  console.log(votesMax);
  return {
    type: CHANGE_VOTES,
    votesMin,
    votesMax,
  };
}

export const CHANGE_PROFIT = 'CHANGE_PROFIT';

export function changeProfit(profitMin, profitMax) {
  return {
    type: CHANGE_PROFIT,
    profitMin,
    profitMax,
  };
}

export const CHANGE_IMPLEMENTATION_TTM = 'CHANGE_IMPLEMENTATION_TTM';

export function changeImplementationTTM(
  implementationTTMMin,
  implementationTTMMax
) {
  return {
    type: CHANGE_IMPLEMENTATION_TTM,
    implementationTTMMin,
    implementationTTMMax,
  };
}

export const SET_DEFAULT_FILTER = 'SET_DEFAULT_FILTER';

export function setDefaultFilter() {
  return {
    type: SET_DEFAULT_FILTER,
  };
}

export const OPEN_IDEA_MODAL = 'OPEN_IDEA_MODAL';

export function openIdeaModal() {
  return {
    type: OPEN_IDEA_MODAL,
  };
}

export const CLOSE_IDEA_MODAL = 'CLOSE_IDEA_MODAL';

export function closeIdeaModal() {
  return {
    type: CLOSE_IDEA_MODAL,
  };
}

export const OPEN_ATTACHMENT_MODAL = 'OPEN_ATTACHMENT_MODAL';

export function openAttachmentModal() {
  return {
    type: OPEN_ATTACHMENT_MODAL,
  };
}

export const CLOSE_ATTACHMENT_MODAL = 'CLOSE_ATTACHMENT_MODAL';

export function closeAttachmentModal() {
  return {
    type: CLOSE_ATTACHMENT_MODAL,
  };
}

export const GET_TAGS_REQUEST = 'GET_TAGS_REQUEST';

export function getTagsRequest() {
  return {
    type: GET_TAGS_REQUEST,
  };
}

export const GET_TAGS_SUCCESS = 'GET_TAGS_SUCCESS';

function getTagsSuccess(tags) {
  return {
    type: GET_TAGS_SUCCESS,
    popularTags: tags,
  };
}

export const GET_TAGS_FAILURE = 'GET_TAGS_FAILURE';

function getTagsFailure(message) {
  return {
    type: GET_TAGS_FAILURE,
    message,
  };
}

export function fetchTags() {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;

  let config = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
  };
  return dispatch => {
    dispatch(getTagsRequest());

    const url = `${API_BASE_URI}/ideas/tags`;

    return fetchWithAuth(url, config)
      .then(response => response.json().then(body => ({ body, response })))
      .then(({ body, response }) => {
        if (!response.ok) {
          dispatch(getTagsFailure(`Failed to get tags. ${body.error}`));
          return Promise.reject(body.error);
        }

        dispatch(getTagsSuccess(body));
        return true;
      })
      .catch(err => {
        dispatch(getTagsFailure(`Failed to get tags. ${err}`));
        console.log('Error: ', err);
      });
  };
}

export const CLEAR_ALL_REQUEST = 'CLEAR_ALL_REQUEST';
export const CLEAR_ALL_FINISH = 'CLEAR_ALL_FINISH';

export function clearAllFilters(flag) {
  return dispatch => {
    if (flag) {
      dispatch(clearAllRequest());
    } else {
      dispatch(clearAllFinish());
    }
  };
}

function clearAllRequest() {
  return {
    type: CLEAR_ALL_REQUEST,
  };
}

function clearAllFinish() {
  return {
    type: CLEAR_ALL_FINISH,
  };
}
