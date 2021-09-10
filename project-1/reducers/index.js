import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import common from './common';
import user from './user';
import basic from './basic';
import message from './message';
import chatmeta from './chatmeta';
import report from './report';
import demand from './demand';
import profile from './profile';
import serviceItems from './serviceItems';
import pay from './pay';
import wordpress from './wordpress';
import collection from './collection';
import introduct from './introduct';
import demandWindow from './demandWindow';
import cases from './cases';
import setting from './setting';
import gigManage from './gigManage.js';

const rootReducer = combineReducers({
  form: formReducer,
  common: common,
  user,
  basic,
  message,
  chatmeta,
  report,
  demand,
  profile,
  serviceItems,
  pay,
  wordpress,
  collection,
  introduct,
  demandWindow,
  cases,
  setting,
  gigManage
});

export default rootReducer;
