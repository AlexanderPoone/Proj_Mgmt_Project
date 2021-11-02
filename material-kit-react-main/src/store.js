import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import logger from 'redux-logger'
import thunk from 'redux-thunk';

export const configureAppStore  = (preloadedState) => {
    const store = configureStore({
        reducer: rootReducer,
        preloadedState,
        middleware: [logger, thunk],
    });

    // handle hot reloading
    // if (process.env.NODE_ENV !== 'production' && module.hot) {
    //     module.hot.accept('./reducers', () => store.replaceReducer(rootReducer));
    // }

    return store;
}