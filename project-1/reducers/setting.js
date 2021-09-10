
import { message } from 'antd';

const initState = {
  defaultSubscribeForm: {
    basicId: 0,
    demanderSubscriptions: [],
    topperSubscriptions: []
  },
  updateSubscribe: null
};

const settingReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOAD_SUBSCRIBE_SUCCESS': {
      return {
        ...state,
        defaultSubscribeForm: action.payload,
      };
    }
    case 'UPDATE_SUBSCRIBE_SUCCESS': {
      message.success('修改成功，新的設定將於明天生效');
      return {
        ...state,
        updateSubscribe: action.payload,
      };
    }
    default:
      return state;
  }
};
export default settingReducer;
