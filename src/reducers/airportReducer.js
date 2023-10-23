import { Actions } from 'src/configs';

const initialState = [];
const airportReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.GET_AIRPORT_SUCCESS:
            return action.payload.airport_list;
        default:
            return state;
    }
}

export default airportReducer;