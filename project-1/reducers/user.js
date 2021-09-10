import { message } from 'antd';
import sysMsg from '../util/messageUtil.js';

const initState = {
  pid: null,
  familyname: null,
  sex: 0,
  pic: 0,
  meta: {
    credit: null,
    deposit: null,
    basicId: null,
  },
};

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOAD_USER_INFO_SUCCESS': {
      return action.payload || state;
    }

    case 'LOAD_USER_INFO_ISSUES': {
      // 特殊狀況,處理AC聯登
      if (action.payload.status && action.payload.status === 311) {
        message.loading('Loading in progress..', 0);
        location.href = '/api/login';
      } else if (action.payload.status && action.payload.status >= 500 && action.payload.status < 503) {
        sysMsg(action, true);
      } else if (action.payload.status && action.payload.status == 401) {
        console.log('清除登入 state');
        return initState;
      }
      return state;
    }

    case 'FAILURE': {
      if (action.payload.status && action.payload.status == 401) {
        return initState;
      }
      return state;
    }

    case 'LOOKED_SUCCESS': {
      return action.payload;
    }

    case 'LOAD_BASIC_INFO_SUCCESS': {
      return {
        ...state,
        basic: action.payload
      };
    }

    default:
      return state;
  }
};
export default userReducer;
