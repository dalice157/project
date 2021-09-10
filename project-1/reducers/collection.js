import { message } from 'antd';
import sysMsg from '../util/messageUtil.js';

const initState = {
  paged: {
    data: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    facets: {},
    fileMap: {},
    start: 0,
    total: 0
  },
  gigListLoading: true,
  totalGigs: 0
};
const collectionReducer = (state = initState, action) => {
  switch (action.type) {
    case 'ADD_GIG_FROM_COLLECTION': {
      const totalGigs = state.totalGigs;
      const gigs = state.paged.data.map((gig) => {
        if (gig.gigId !== action.payload.data.gigId) {
          return gig;
        } else {
          return {
            ...gig,
            favoriteId: action.payload.data.favoriteId
          };
        }
      });
      message.success('已加入收藏');
      return {
        ...state,
        paged: {
          ...state.paged,
          data: gigs
        },
        gigListLoading: false,
        totalGigs: totalGigs + 1
      };
    }
    case 'REMOVE_GIG_FROM_COLLECTION': {
      const totalGigs = state.totalGigs;
      const gigs = state.paged.data.map((gig) => {
        if (gig.gigId != action.payload.data.gigId) {
          return gig;
        } else {
          return {
            ...gig,
            favoriteId: null
          };
        }
      });
      message.success('收藏已取消');
      return {
        ...state,
        paged: {
          ...state.paged,
          data: gigs
        },
        gigListLoading: false,
        totalGigs: totalGigs - 1
      };
    }
    case 'LOAD_GIGLIST_COLLECTION_SUCCESS': {
      return {
        ...state,
        paged: action.payload ? action.payload : state.paged,
        gigListLoading: false,
        totalGigs: action.payload ? action.payload.total : state.paged.total
      };
    }
    case 'JOIN_TOP_AND_ADD_GIG': {
      message.success('已正式成為104高手會員');
      return state;
    }
    case 'JOIN_TOP_AND_ADD_GIG_ISSUES': {
      sysMsg(action, true);
      return state;
    }
    case 'REQUEST_LOAD_GIGLIST_COLLECTION': {
      return {
        ...state,
        gigListLoading: true
      };
    }
    case 'LOAD_GIGLIST_COLLECTION_ISSUES': {
      sysMsg(action, true);
      return {
        ...state,
        gigListLoading: true
      };
    }
    default:
      return state;
  }
};

export default collectionReducer;
