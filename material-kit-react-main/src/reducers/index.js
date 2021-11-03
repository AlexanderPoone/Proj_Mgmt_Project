// ./reducers.js
import { combineReducers } from 'redux';
// import reducers here...
import LoginReducer from './LoginReducer';
import AppReducer from './AppReducer';

const rootReducer = combineReducers({
  // combine reducers here...
  app: AppReducer,
  login: LoginReducer
});

export default rootReducer;