import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

export const configureAppStore = (preloadedState) => {
    const store = configureStore({
        reducer: rootReducer,
        preloadedState,
    });

    // handle hot reloading
    if (process.env.NODE_ENV !== 'production' && module.hot) {
        module.hot.accept('./reducers', () => store.replaceReducer(rootReducer));
    }

    return store;
}