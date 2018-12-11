import {User} from "../models/User";

export interface State {
    user: User,
    loading: boolean
}

export const initialState: State = {
    user: {
        id: null,
        name: '',
        email: '',
        token: ''
    },
    loading: false
};