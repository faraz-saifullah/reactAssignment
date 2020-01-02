import {
  ACCOUNT_PROFILE_FAILURE,
  ACCOUNT_PROFILE_REQUEST,
  ACCOUNT_PROFILE_RESET,
  ACCOUNT_PROFILE_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
  CHANGE_PASSWORD_SUCCESS,
  SET_PROFILE_EDIT_MODE,
  SET_SHOW_CHANGE_PASSWORD_MODAL,
  UPDATE_PROFILE_FAILURE,
  UPDATE_PROFILE_SUCCESS,
  UPLOAD_PROFILE_PICTURE_FAILURE,
  UPLOAD_PROFILE_PICTURE_REQUEST,
  UPLOAD_PROFILE_PICTURE_SUCCESS,
} from '../actions/profile';
import { TOGGLE_VOTE_SUCCESS } from '../actions/ideas';

const initialState = {
  likedIdeasArr: [],
  userAccountInfo: {},
  accountInfoLoaded: false,
  editingProfile: false,
  profileErrors: {
    message: '',
    details: {},
  },
  showChangePasswordModal: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ACCOUNT_PROFILE_SUCCESS:
      return Object.assign({}, state, {
        likedIdeasArr: action.body.recentlyLikedIdeas,
        userAccountInfo: action.body.userAccountInfo,
        accountInfoLoaded: true,
      });
    case ACCOUNT_PROFILE_FAILURE:
      return Object.assign({}, state, {
        accountInfoLoaded: false,
        userAccountInfo: {},
      });
    case ACCOUNT_PROFILE_REQUEST:
      return Object.assign({}, state, {
        likedIdeasArr: [],
      });
    case ACCOUNT_PROFILE_RESET:
      return Object.assign({}, state, {
        likedIdeasArr: [],
        userAccountInfo: {},
        accountInfoLoaded: false,
        editingProfile: false,
        profileErrors: {
          message: '',
          details: {},
        },
      });
    case UPLOAD_PROFILE_PICTURE_REQUEST:
      return Object.assign({}, state, {
        editingProfile: false,
        profileErrors: {
          message: '',
          details: {},
        },
      });
    case UPLOAD_PROFILE_PICTURE_SUCCESS:
      return Object.assign({}, state, {
        likedIdeasArr: action.body.recentlyLikedIdeas,
        userAccountInfo: action.body.userAccountInfo,
        profileErrors: {
          message: '',
          details: {},
        },
      });
    case UPLOAD_PROFILE_PICTURE_FAILURE:
      return Object.assign({}, state, {
        profileErrors: {
          message: action.message,
          details: {},
        },
      });
    case SET_PROFILE_EDIT_MODE:
      return Object.assign({}, state, {
        editingProfile: action.edit,
        profileErrors: {
          message: '',
          details: {},
        },
      });
    case UPDATE_PROFILE_FAILURE:
      return Object.assign({}, state, {
        profileErrors: {
          message: action.message.message,
          details:
            action.message.details === null ? {} : action.message.details,
        },
      });
    case TOGGLE_VOTE_SUCCESS: {
      let newIdeas = state.likedIdeasArr;
      const index = state.likedIdeasArr.findIndex(x => x.id === action.idea.id);
      if (index !== -1) {
        if (action.idea.liked == false) {
          newIdeas = [
            ...state.likedIdeasArr.slice(0, index),
            ...state.likedIdeasArr.slice(index + 1),
          ];
        }
      } else {
        if (action.idea.liked == true) {
          newIdeas = [...state.likedIdeasArr, action.idea];
        }
      }
      return Object.assign({}, state, {
        likedIdeasArr: newIdeas,
      });
    }
    case UPDATE_PROFILE_SUCCESS:
      return Object.assign({}, state, {
        likedIdeasArr: action.body.recentlyLikedIdeas,
        userAccountInfo: action.body.userAccountInfo,
        editingProfile: false,
        profileErrors: {
          message: '',
          details: {},
        },
      });
    case SET_SHOW_CHANGE_PASSWORD_MODAL:
      return Object.assign({}, state, {
        showChangePasswordModal: action.show,
        profileErrors: {
          message: '',
          details: {},
        },
      });
    case CHANGE_PASSWORD_FAILURE:
      return Object.assign({}, state, {
        profileErrors: {
          message: action.message.message,
          details:
            action.message.details === null ? {} : action.message.details,
        },
      });
    case CHANGE_PASSWORD_SUCCESS:
      return Object.assign({}, state, {
        showChangePasswordModal: false,
        profileErrors: {
          message: '',
          details: {},
        },
      });
    default:
      return state;
  }
}
