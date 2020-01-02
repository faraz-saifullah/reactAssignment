/* eslint-disable no-case-declarations */
import {
  GET_INVITE_LINK_FAILURE,
  GET_INVITE_LINK_SUCCESS,
  GEN_LINK_FAILURE,
  GEN_LINK_SUCCESS,
  SEND_INVITE_EMAIL_FAILURE,
  SEND_INVITE_EMAIL_SUCCESS,
  GET_DOMAIN_SUCCESS,
  GET_DOMAIN_FAILURE,
  ADD_DOMAIN_FAILURE,
  ADD_DOMAIN_SUCCESS,
  DELETE_DOMAIN_FAILURE,
  DELETE_DOMAIN_SUCCESS,
  GET_INVITED_USER_REQUEST,
  GET_INVITED_USER_FAILURE,
  GET_INVITED_USER_SUCCESS,
  RESEND_INVITE_FAILURE,
  RESEND_INVITE_SUCCESS,
  DELETE_INVITE_FAILURE,
  DELETE_INVITE_SUCCESS,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  UPDATE_PAGE_TITLE_SUCCESS,
  UPDATE_USER_ROLE_SUCCESS,
  UPDATE_USER_ROLE_REQUEST,
  UPDATE_USER_ROLE_FAILURE,
  DELETE_USER_SUCCESS,
  DELETE_USER_REQUEST,
  DELETE_USER_FAILURE,
  GET_MEMBER_REQUEST,
  GET_MEMBER_SUCCESS,
  GET_MEMBER_FAILURE,
} from '../actions/admin';

export function admin(
  state = {
    linkActive: false,
    inviteLink: '',
    getLinkError: '',
    genLinkError: '',
    sendInviteError: '',
    failedInvitations: [],
    sentInvitations: [],
    domains: [],
    getDomainError: '',
    addDomainError: '',
    deleteDomainError: '',
    invitedUsers: {
      content: [],
      empty: false,
      totalElements: 0,
      isFetching: false,
      totalPages: 0,
      number: 0,
      pageSize: 10,
      errorMessage: '',
    },
    users: {
      content: [],
      empty: false,
      totalElements: 0,
      isFetching: false,
      totalPages: 0,
      number: 0,
      pageSize: 10,
      errorMessage: '',
    },
    appLogo:
      'https://idex-staging.s3-ap-southeast-1.amazonaws.com/assets/app_logo.png',
    emailLogo:
      'https://idex-staging.s3-ap-southeast-1.amazonaws.com/assets/email_logo.png',
    faviconLogo:
      'https://idex-staging.s3-ap-southeast-1.amazonaws.com/assets/favicon.png',
    color1: '2D8DFC',
    color2: '333333',
    color3: 'FAFAFA',
    title: 'IDEX Innovation',
    totalMembers: 0,
    isLoading: false,
  },
  action
) {
  switch (action.type) {
    case GET_INVITE_LINK_SUCCESS:
      return Object.assign({}, state, {
        inviteLink: action.body.inviteLink,
        linkActive: action.body.active,
      });
    case GET_INVITE_LINK_FAILURE:
      return Object.assign({}, state, {
        getLinkError: action.message,
      });
    case GEN_LINK_FAILURE:
      return Object.assign({}, state, {
        genLinkError: action.message,
      });
    case GEN_LINK_SUCCESS:
      return Object.assign({}, state, {
        inviteLink: action.body.inviteLink,
        linkActive: action.body.active,
      });
    case SEND_INVITE_EMAIL_FAILURE:
      return Object.assign({}, state, {
        sendInviteError: action.message,
      });
    case SEND_INVITE_EMAIL_SUCCESS:
      return Object.assign({}, state, {
        sendInviteError: '',
        failedInvitations: action.body.failedInvitations,
        sentInvitations: action.body.sentInvitations,
      });
    case GET_DOMAIN_SUCCESS:
      return Object.assign({}, state, {
        getDomainError: '',
        domains: action.body,
      });
    case GET_DOMAIN_FAILURE:
      return Object.assign({}, state, {
        getDomainError: action.message,
        domains: [],
      });
    case ADD_DOMAIN_SUCCESS:
      return Object.assign({}, state, {
        domains: [...state.domains, action.body],
        addDomainError: '',
      });
    case ADD_DOMAIN_FAILURE:
      return Object.assign({}, state, {
        addDomainError: action.message,
      });
    case DELETE_DOMAIN_FAILURE:
      return Object.assign({}, state, {
        deleteDomainError: action.message,
      });
    case DELETE_DOMAIN_SUCCESS:
      return Object.assign({}, state, {
        domains: action.body,
        deleteDomainError: '',
      });
    case GET_INVITED_USER_REQUEST:
      const newInvitedUsers = state.invitedUsers;
      newInvitedUsers.isFetching = true;
      return Object.assign({}, state, {
        invitedUsers: newInvitedUsers,
      });
    case GET_INVITED_USER_FAILURE:
      const newInvitedUsers1 = state.invitedUsers;
      newInvitedUsers1.isFetching = false;
      newInvitedUsers1.errorMessage = action.message;
      newInvitedUsers1.content = [];
      return Object.assign({}, state, { invitedUsers: newInvitedUsers1 });
    case GET_INVITED_USER_SUCCESS:
      const newInvitedUsers2 = state.invitedUsers;
      const result = action.body;
      newInvitedUsers2.isFetching = false;
      newInvitedUsers2.errorMessage = '';
      newInvitedUsers2.content = result.content;
      newInvitedUsers2.number = result.number;
      newInvitedUsers2.pageSize = result.size;
      newInvitedUsers2.totalElements = result.totalElements;
      newInvitedUsers2.totalPages = result.totalPages;
      newInvitedUsers2.empty = result.empty;
      return Object.assign({}, state, { invitedUsers: newInvitedUsers2 });
    case RESEND_INVITE_SUCCESS:
      let newInvitedUsers4 = state.invitedUsers;
      const index = state.invitedUsers.content.findIndex(
        x => x.id === action.id
      );
      if (index !== -1) {
        newInvitedUsers4 = [
          ...state.invitedUsers.content.slice(0, index),
          action.body,
          ...state.invitedUsers.content.slice(index + 1),
        ];
      }
      return Object.assign({}, state, { invitedUsers: newInvitedUsers4 });
    case RESEND_INVITE_FAILURE:
      return Object.assign({}, state, {
        resendInviteError: action.message,
      });
    case DELETE_INVITE_FAILURE:
      return Object.assign({}, state, {
        deleteInviteError: action.message,
      });
    case DELETE_INVITE_SUCCESS:
      const newInvitedUsers3 = state.invitedUsers;
      const result1 = action.body;
      newInvitedUsers3.isFetching = false;
      newInvitedUsers3.errorMessage = '';
      newInvitedUsers3.pageSize = result1.size;
      newInvitedUsers3.content = result1.content;
      newInvitedUsers3.number = result1.number;
      newInvitedUsers3.totalElements = result1.totalElements;
      newInvitedUsers3.totalPages = result1.totalPages;
      newInvitedUsers3.empty = result1.empty;
      return Object.assign({}, state, { invitedUsers: newInvitedUsers3 });
    case GET_USER_REQUEST:
      const newUsers = state.users;
      newUsers.isFetching = true;
      return Object.assign({}, state, {
        users: newUsers,
      });
    case GET_USER_FAILURE:
      const newUsers1 = state.users;
      newUsers1.isFetching = false;
      newUsers1.errorMessage = action.message;
      newUsers1.content = [];
      return Object.assign({}, state, { users: newUsers1 });
    case GET_USER_SUCCESS:
      const newUsers2 = state.users;
      const result4 = action.body;
      newUsers2.isFetching = false;
      newUsers2.errorMessage = '';
      newUsers2.content = result4.content;
      newUsers2.number = result4.number;
      newUsers2.totalElements = result4.totalElements;
      newUsers2.totalPages = result4.totalPages;
      newUsers2.empty = result4.empty;
      return Object.assign({}, state, { users: newUsers2 });
    case UPDATE_PAGE_TITLE_SUCCESS:
      return Object.assign({}, state, {
        title: action.title,
      });
    case UPDATE_USER_ROLE_REQUEST:
      console.log('INSIDE HERE REQUEST');
      let storedUsers3 = state.users;
      storedUsers3.isFetching = true;
      return Object.assign({}, state, {
        users: storedUsers3,
      });
    case UPDATE_USER_ROLE_FAILURE:
      let storedUsers4 = state.users;
      storedUsers4.isFetching = false;
      storedUsers4.errorMessage = action.message;
      storedUsers4.content = [];
      return Object.assign({}, state, { users: storedUsers4 });
    case UPDATE_USER_ROLE_SUCCESS:
      let org_users = state.users;
      let org_content = org_users.content;
      let accounts = action.body.accounts;
      org_content.map(user => {
        for (let i = 0; i < accounts.length; i++) {
          if (accounts[i].id === user.id) {
            user.authorities = accounts[i].authorities;
          }
        }
        return user;
      });
      org_users.content = org_content;
      org_users.isFetching = false;
      org_users.errorMessage = '';
      return Object.assign({}, state, { users: org_users });
    case DELETE_USER_REQUEST:
      let storedUsers1 = state.users;
      storedUsers1.isFetching = true;
      return Object.assign({}, state, {
        users: storedUsers1,
      });
    case DELETE_USER_FAILURE:
      let storedUsers2 = state.users;
      storedUsers2.isFetching = false;
      storedUsers2.errorMessage = action.message;
      storedUsers2.content = [];
      return Object.assign({}, state, { users: storedUsers2 });
    case DELETE_USER_SUCCESS:
      let storedUsers = state.users;
      let usersOutput = action.body;
      storedUsers.isFetching = false;
      storedUsers.errorMessage = '';
      storedUsers.content = usersOutput.content;
      storedUsers.number = usersOutput.number;
      storedUsers.totalElements = usersOutput.totalElements;
      storedUsers.totalPages = usersOutput.totalPages;
      storedUsers.empty = usersOutput.empty;
      return Object.assign({}, state, { users: storedUsers });
    case GET_MEMBER_REQUEST:
      return Object.assign({}, state, {
        isLoading: true,
      });
    case GET_MEMBER_FAILURE:
      return Object.assign({}, state, { isLoading: false });
    case GET_MEMBER_SUCCESS:
      const totalMembers2 = action.body.count;
      return Object.assign({}, state, {
        isLoading: true,
        totalMembers: totalMembers2,
      });
    default:
      return state;
  }
}
