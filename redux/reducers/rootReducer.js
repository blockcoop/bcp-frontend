import { combineReducers } from "redux"
import message from "./message";
import metamask from "./metamask";

const rootReducer = combineReducers({
    metamask: metamask,
    message: message
})

export default rootReducer;