import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

const rootReducer = combineReducers({ users: userReducer });

export default rootReducer;
