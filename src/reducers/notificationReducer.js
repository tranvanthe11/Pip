import { Actions } from "src/configs";

const initialState = {};
const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.UPDATE_NOTIFICATION_SUCCESS:
      return {
        ...state,
        data: action.payload.data,
      };
    default:
      return state;
  }
};

export default notificationReducer;
