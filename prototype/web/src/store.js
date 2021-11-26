import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import logger from 'redux-logger'
import thunk from 'redux-thunk';

export const store = configureStore({
    reducer: rootReducer,
    preloadedState: localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : {},
    middleware: [logger, thunk],
});