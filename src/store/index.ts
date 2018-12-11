import { createStore } from "redux";
import rootReducer from "./reducers";
import {initialState} from "./store";
const createAppStore = createStore(rootReducer);
export default createAppStore;
