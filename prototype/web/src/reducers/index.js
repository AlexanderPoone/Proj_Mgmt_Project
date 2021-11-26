// ./reducers.js
import { combineReducers } from 'redux';
// import reducers here...
import LoginReducer from './LoginReducer';
import AppReducer from './AppReducer';
import RepoReducer from './RepoReducer';
import UserReducer from './UserReducer';
import IssueReducer from './IssueReducer';
import MileStoneReducer from './MileStoneReducer';

const rootReducer = combineReducers({
  // combine reducers here...
  app: AppReducer,
  // login: LoginReducer,
  repo: RepoReducer,
  user: UserReducer,
  issue: IssueReducer,
  milestone: MileStoneReducer
});

export default rootReducer;