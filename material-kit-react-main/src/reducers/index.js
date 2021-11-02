// ./reducers.js
import { combineReducers } from 'redux';
// import reducers here...
import LoginReducer from './LoginReducer';


const rootReducer = combineReducers({
  // combine reducers here...
  login: LoginReducer
});

export default rootReducer;