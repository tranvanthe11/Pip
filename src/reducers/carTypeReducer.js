import { Actions } from 'src/configs';

const initialState = [];
const carTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.GET_CAR_TYPE_SUCCESS:
            return action.payload.car_type_list;
        default:
            return state;
    }
}

export default carTypeReducer;