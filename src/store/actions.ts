import {User} from "../models/User";

export const UPDATE_USER = "[User] Update";
export const LOADING_USER = "[User] Loading";

export interface UpdateUserAction {
    type: "[User] Update";
    payload: User

}
export interface LoadingUserAction {
    type: "[User] Loading";
    payload: boolean

}
export function updateUser(user: User): UpdateUserAction {
    return {
        type: UPDATE_USER,
        payload: user
    }
}

export function loadingUser(loading: boolean): LoadingUserAction {
    return {
        type: LOADING_USER,
        payload: loading
    }
}
export type AllAppActions = UpdateUserAction | LoadingUserAction;