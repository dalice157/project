
import { message as antdMessage } from 'antd';

const initData = {
  plans: {
    table: {
      target: null,
      compare: null,
      ratio: null,
    },
    isCompared: false,
  },
  sales: {
    table: {
      targetMonth: null,
      compareMonth: null,
      ratio: null,
    },
    isCompared: false,
  },
  salesDaily: null,
  categoryPool: {},
};
export default function (state = initData, action) {
  switch (action.type) {
    case 'LOAD_SALES_STATISTICS_SUCCESS': {
      antdMessage.success('營收報表載入成功');
      const { payload } = action;
      const { compareMonth } = payload;
      if (compareMonth) {
        return {
          ...state,
          sales: {
            ...state.sales.table,
            table: payload,
            isCompared: true,
          },
        };
      }
      return {
        ...state,
        sales: {
          ...state.sales.table,
          table: payload,
          isCompared: false,
        },
      };
    }
    case 'LOAD_SALES_DAILY_STATISTICS_SUCCESS': {
      return {
        ...state,
        salesDaily: action.payload,
      };
    }
    case 'LOAD_PLANS_STATISTICS_SUCCESS': {
      antdMessage.success('統計報表載入成功');
      const { payload } = action;
      const { compare } = payload;
      if (compare) {
        return {
          ...state,
          plans: {
            ...state.plans.table,
            table: payload,
            isCompared: true,
          },
        };
      }
      return {
        ...state,
        plans: {
          ...state.plans.table,
          table: payload,
          isCompared: false,
        },
      };
    }
    case 'LOAD_CATEGORY_POOL_SUCCESS': {
      antdMessage.success('報表載入成功');
      const { payload } = action;
      return {
        ...state,
        categoryPool: {
          ...payload,
        },
      };
    }
    default:
      return state;
  }
}
