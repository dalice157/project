import { message } from 'antd';
import sysMsg from '../util/messageUtil.js';

const messageReducer = (state = {}, action) => {
  switch (action.type) {
    case 'REQUEST_LOADING': {
      const hide = message.loading('Loading in progress..', 0);
      // Dismiss manually and asynchronously
      setTimeout(hide, 500);

      return state;
    }

    case 'SUCCESS_MSG': {
      sysMsg(action);
      return state;
    }

    case 'FAILURE': {
      sysMsg(action, true);


      return state;
    }

    default:
      return state;
  }
};
export default messageReducer;
