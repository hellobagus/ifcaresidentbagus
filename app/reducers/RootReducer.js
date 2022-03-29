import {combineReducers} from 'redux';
import error from './ErrorReducer';
import user from './UserReducer';
import notifDataRed from './notifReducer';
import status from './StatusReducer';
import AuthReducer from './auth';
import ApplicationReducer from './application';
import counter from './reduceNotif';
import apiReducer from '../config/ApiReducer';

const rootReducer = combineReducers({
  error,
  user,
  notifDataRed,
  counter,
  status,
  apiReducer,
  auth: AuthReducer,
  application: ApplicationReducer,
});

export default rootReducer;
