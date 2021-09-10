import { message as antdMessage } from 'antd';

const initState = {
  assignments: [],
  controllerItems: [
    {
      block: 'Assignment',
      type: 'organic-edit',
      slots: 0,
      robotSwitch: 0
    },
    {
      block: 'Assignment',
      type: 'organic-apply',
      slots: 0,
      robotSwitch: 0
    },
    {
      block: 'Assignment',
      type: 'robot-submit',
      slots: 0,
      robotSwitch: 0
    },
    {
      block: 'Assignment',
      type: 'dev-list',
      slots: 0,
      robotSwitch: 0
    }
  ],
  pidList: [],
  testAccount: {
    data: [],
    loading: false,
  },
};


export default function (state = initState, action) {
  switch (action.type) {
    case 'LOAD_ASSIGNMENT_SUCCESS': {
      return {
        ...state,
        assignments: action.payload.length ? initState.controllerItems.map((item) => {
          const vItem = action.payload.find(ass => ass.type === item.type);
          return vItem ? {
            ...item,
            slots: vItem.slots,
            robotSwitch: vItem.robotSwitch
          } : item;
        }) : initState.controllerItems,
      };
    }

    case 'EXCHANGE_EMAIL_SUCCESS': {
      return {
        ...state,
        pidList: action.payload
      };
    }

    case 'EXCHANGE_EMAIL_CLEAN': {
      return {
        ...state,
        pidList: []
      };
    }
    case 'REQUEST_TEST_ACCOUNT': {
      return {
        ...state,
        testAccount: {
          ...state.testAccount,
          loading: true,
        },
      };
    }
    case 'ADD_TEST_ACCOUNT_SUCCESS': {
      antdMessage.success('新增測試帳號成功');
      return state;
    }
    case 'REMOVE_TEST_ACCOUNT_SUCCESS': {
      antdMessage.success('刪除測試帳號成功');
      return state;
    }
    case 'LOAD_TEST_ACCOUNT_SUCCESS': {
      return {
        ...state,
        testAccount: {
          ...state.testAccount,
          data: action.payload,
          loading: false,
        },
      };
    }
    default:
      return state;
  }
}
