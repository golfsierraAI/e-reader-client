import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from 'redux'
// reducers
import book from 'slices/book'
import snackbar from 'slices/snackbar'

const reducer = combineReducers({
	book,
	snackbar
});

export type RootState = ReturnType<typeof reducer>

const store = configureStore({
	reducer,	
});

export default store