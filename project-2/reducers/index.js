import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import message from './message';
import order from './order';
import violation from './violation';
import user from './user';
import member from './member';
import inviteCode from './inviteCode';
import common from './common';
import demand from './demand';
import review from './review';
import setting from './setting';
import statistics from './statistics';
import memo from './memo';

const rootReducer = combineReducers({
  form: formReducer,
  message,
  order,
  violation,
  member,
  inviteCode,
  common,
  user,
  demand,
  review,
  setting,
  memo,
  statistics,
});

export default rootReducer;
