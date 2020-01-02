import {
  CONTACT_US_SUCCESS,
  CONTACT_US_FAILURE,
  CONTACT_US_RESET,
} from '../actions/contact';

const initialState = {
  sent: false,
  sendErrorMessage: {
    message: '',
    details: {},
  },
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CONTACT_US_SUCCESS:
      return Object.assign({}, state, {
        sent: action.sent,
        sendErrorMessage: {
          message: '',
          details: {},
        },
      });
    case CONTACT_US_FAILURE:
      return Object.assign({}, state, {
        sent: false,
        sendErrorMessage: {
          message: action.message.message,
          details:
            action.message.details === null ? {} : action.message.details,
        },
      });
    case CONTACT_US_RESET:
      return Object.assign({}, state, {
        sent: false,
        sendErrorMessage: {
          message: '',
          details: {},
        },
      });
    default:
      return state;
  }
}
