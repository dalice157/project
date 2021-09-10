import { message as antdMessage } from 'antd';
import sysMsg from '../util/messageUtil.js';

const initState = {
  orderList: {
    data: [],
  },
  singleSearchLoading: false,
  paymentList: [],
  cursor: null,
  refundDatas: {
    data: null,
  },
  depositPersonList: {
    cursor: null,
    data: [],
  },
  paymentPersonList: {
    cursor: null,
    data: [],
  },
};

export default function (state = initState, action) {
  switch (action.type) {
    case 'ORDER_MULTI_SEARCH_SUCCESS': {
      antdMessage.success('多條件查詢成功');
      return {
        ...state,
        paymentList: action.payload.preCursor ? [...state.paymentList, ...action.payload.data] : action.payload.data,
        cursor: action.payload.cursor,
      };
    }
    case 'REQUEST_ORDER_SINGLE_SEARCH': {
      return {
        ...state,
        singleSearchLoading: true,
      };
    }
    case 'ORDER_SINGLE_SEARCH_SUCCESS': {
      antdMessage.success('單一條件查詢成功');
      return {
        ...state,
        paymentList: action.payload.preCursor ? [...state.paymentList, ...action.payload.data] : action.payload.data,
        cursor: action.payload.cursor,
        singleSearchLoading: false,
      };
    }
    case 'FAILURE_ORDER_SINGLE_SEARCH': {
      antdMessage.error('單一條件查詢失敗');
      return {
        ...state,
        singleSearchLoading: false,
      };
    }
    case 'REQUEST_SEND_REFUND': {
      antdMessage.loading('款項退款中');
      return state;
    }
    case 'SEND_REFUND_SUCCESS': {
      antdMessage.success('款項退款成功');
      return {
        ...state,
        refundDatas: action.payload
      };
    }
    case 'LOAD_ORDER_SUCCESS': {
      return {
        ...state,
        orders: action.payload.preCursor ? [...state.orders, ...action.payload.data] : action.payload.data,
        next: action.payload.cursor
      };
    }
    case 'UPDATE_ORDER_SUCCESS': {
      const newItems = state.orders.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        } else {
          return item;
        }
      });
      sysMsg(action);
      return {
        ...state,
        orders: newItems
      };
    }
    case 'LOAD_DEPOSIT_LIST_SUCCESS': {
      return {
        ...state,
        depositPersonList: {
          ...state.depositPersonList,
          data: action.payload.preCursor ? [...state.depositPersonList.data, ...action.payload.data] : action.payload.data,
          cursor: action.payload.cursor,
        }
      };
    }
    case 'LOAD_PAYMENT_LIST_SUCCESS': {
      return {
        ...state,
        paymentPersonList: {
          ...state.paymentPersonList,
          data: action.payload.preCursor ? [...state.paymentPersonList.data, ...action.payload.data] : action.payload.data,
          cursor: action.payload.cursor,
        }
      };
    }
    default:
      return state;
  }
}
