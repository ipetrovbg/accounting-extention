import {AllAppActions, LOADING_USER, UPDATE_USER} from "../actions";
import {initialState, State} from "../store";



const reducer = (state = initialState, action: AllAppActions): State => {
    switch (action.type) {
        case UPDATE_USER: {
            return { ...state, user: { ...action.payload }  };
        }
        case LOADING_USER: {
            return {
                ...state,
                loading: action.payload
            }
        }
        default: return state;
    }
};

export default reducer;
