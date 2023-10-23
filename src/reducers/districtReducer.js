import { Actions } from "src/configs";

const initialState = [];
const districtReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.GET_DISTRICT_SUCCESS:
      return action.payload.district_list;
    default:
      return state;
  }
};

export default districtReducer;
