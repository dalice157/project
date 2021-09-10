import { message } from 'antd';
import sysMsg, { error } from '../util/messageUtil.js';

const initState = {
  area: [],
  indust: [],
  paged: {
    data: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    facets: {},
    fileMap: {},
    start: 0,
    total: 0,
  },
  gigListLoading: true,
  basic: {},
  gigs: {
    data: [],
    fileMap: {},
  },
  invitableDemands: [],
  verifySMS: {
    success: false,
  },
  verifyPhone: {
    success: false,
  },
  blockInfo: {
    topperName: '-',
    reviewAvgScore: 5.0,
    visitCount: 0,
    dealCount: 0,
    isLoading: true,
  },
  checkBool: false,
  reviewAvg: null,
  reviewGig: null,
  sideBarList: null,
  itemList: null,
  contentData: {
    demandId: '',
    onlineDate: '',
    demandCategory: [],
    assignPlace: [],
    desc: '',
    maxPrice: 0,
    minPrice: 0,
    partnerCount: 0,
    title: '',
    unit: 0,
  },
  topperData: null,
  unsubscribe: false,
  unsubscribeStatus: true,
  isLoadingcellphoneVerity: false,
  isCellphoneVerifiedSubmit: false,
  evaluateTopperInfo: {
    demandTitle: '',
    topperName: '',
    gigTitle: '',
  },
  basicTutorDemand: {
    data: [],
  },
  expertTutorDemand: {
    data: [],
  },
  basicCaseDemand: {
    data: [],
  },
  expertCaseDemand: {
    data: [],
  },
  gigDemandCount: null,
  pickupTutorList: null,
  pickupOutsourceList: null,
  successOutsourceList: null,
  successTutorList: null,
  gigDemandPopularCats: {
    outsourceGigPopularCats: [],
    tutorGigPopularCats: [],
    demandPopularCats: [],
  },
};

const commonReducer = (state = initState, action) => {
  switch (action.type) {
    case 'CHECK_USER_PASS': {
      return {
        ...state,
      };
    }
    case 'CHECK_UNSUBSCRIBE_SUCCESS': {
      return {
        ...state,
        unsubscribeStatus: action.payload,
      };
    }
    case 'LOAD_TOPPER_INTRO': {
      return {
        ...state,
        topperData: action.payload,
      };
    }
    case 'REQUEST_UNSUBSCRIBE': {
      return {
        ...state,
      };
    }
    case 'LOAD_UNSUBSCRIBE_SUCCESS': {
      return {
        ...state,
        unsubscribe: true,
      };
    }
    case 'FAILURE_UNSUBSCRIBE': {
      sysMsg(action, true);
      return {
        ...state,
      };
    }
    case 'ADD_GIG_FROM_GIGSEARCH': {
      const gigs = state.paged.data.map((gig) => {
        if (gig.gigId !== action.payload.data.gigId) {
          return gig;
        }
        return {
          ...gig,
          favoriteId: action.payload.data.favoriteId,
        };
      });
      message.success('已加入收藏');
      return {
        ...state,
        paged: {
          ...state.paged,
          data: gigs,
        },
      };
    }

    case 'REMOVE_GIG_FROM_GIGSEARCH': {
      const gigs = state.paged.data.map((gig) => {
        if (gig.gigId != action.payload.data.gigId) {
          return gig;
        }
        return {
          ...gig,
          favoriteId: action.payload.data.favoriteId,
        };
      });
      message.success('收藏已取消');
      return {
        ...state,
        paged: {
          ...state.paged,
          data: gigs,
        },
      };
    }
    case 'LOAD_GIGLIST_SUCCESS': {
      return {
        ...state,
        paged: action.payload ? action.payload : state.paged,
        gigListLoading: false,
      };
    }
    case 'REQUEST_GIGLIST': {
      return {
        ...state,
        gigListLoading: true,
      };
    }
    case 'LOAD_GIGLIST_ISSUES': {
      sysMsg(action, true);
      return {
        ...state,
        gigListLoading: true,
      };
    }
    case 'LOAD_STATIC_AREA_SUCCESS': {
      return {
        ...state,
        area: action.payload,
      };
    }
    case 'LOAD_STATIC_INDUST_SUCCESS': {
      return {
        ...state,
        indust: action.payload,
      };
    }
    case 'LOAD_BASIC_SUCCESS': {
      return {
        ...state,
        basic: action.payload,
      };
    }
    case 'LOAD_PROFILE_GIGS_SUCCESS': {
      return {
        ...state,
        gigs: {
          data: action.payload.data,
          fileMap: action.payload.fileMap,
        },
      };
    }
    case 'LOAD_PROFILE_INVITABLE_DEMANDS_SUCCESS': {
      return {
        ...state,
        invitableDemands: action.payload,
      };
    }
    case 'FAILURE_SEND_VERIFY_SMS': {
      sysMsg(action, true);
      return {
        ...state,
        isLoadingcellphoneVerity: false,
        isCellphoneVerifiedSubmit: false,
      };
    }
    case 'SEND_VERIFY_SMS_SUCCESS': {
      return {
        ...state,
        verifySMS: action.payload,
        isLoadingcellphoneVerity: false,
        isCellphoneVerifiedSubmit: true,
      };
    }
    case 'REQUEST_SEND_VERIFY_SMS': {
      return {
        ...state,
        isLoadingcellphoneVerity: true,
      };
    }
    case 'RESET_SEND_VERIFY_SMS_SUCCESS': {
      return {
        ...state,
        verifySMS: initState.verifySMS,
      };
    }
    case 'SEND_VERIFY_CELLPHONE_SUCCESS': {
      return {
        ...state,
        verifyPhone: action.payload,
      };
    }
    case 'LOAD_BLOCKINFO': {
      return {
        ...state,
        blockInfo: {
          ...action.payload,
          isLoading: false,
        },
      };
    }
    case 'LOAD_REVIEW_AVG': {
      return {
        ...state,
        reviewAvg: action.payload,
      };
    }
    case 'LOAD_REVIEW_CHECK': {
      return {
        ...state,
        checkBool: action.payload,
      };
    }
    case 'LOAD_REVIEW_GIG': {
      return {
        ...state,
        reviewGig: action.payload,
      };
    }
    case 'LOAD_GIGLIST': {
      return {
        ...state,
        sideBarList: action.payload,
      };
    }
    case 'LOAD_REVIEW_ITEM_LIST': {
      return {
        ...state,
        itemList: action.payload,
      };
    }
    case 'FAVORITE_ISSUES': {
      error(action.payload.response.sysMsgKey || action.payload.status);
      return state;
    }
    case 'LOAD_CONTENT_SUCCES': {
      return {
        ...state,
        contentData: action.payload,
      };
    }
    case 'LOAD_CONFIRM_COOPERATE': {
      message.success('已完成確認合作');
      return state;
    }
    case 'LOAD_ASKREVIEW': {
      return {
        ...state,
        evaluateTopperInfo: action.payload,
      };
    }
    case 'LOAD_EVALUATE_EDM': {
      message.success('已完成合作評價');
      return state;
    }
    case 'LOAD_BASIC_TUTOR_DEMAND_SUCCESS': {
      return {
        ...state,
        basicTutorDemand: action.payload,
      };
    }
    case 'LOAD_EXPERT_TUTOR_DEMAND_SUCCESS': {
      return {
        ...state,
        expertTutorDemand: action.payload,
      };
    }
    case 'LOAD_BASIC_CASE_DEMAND_SUCCESS': {
      return {
        ...state,
        basicCaseDemand: action.payload,
      };
    }
    case 'LOAD_EXPERT_CASE_DEMAND_SUCCESS': {
      return {
        ...state,
        expertCaseDemand: action.payload,
      };
    }
    case 'LOAD_GIGDEMANDCOUNT_SUCCESS': {
      return {
        ...state,
        gigDemandCount: action.payload,
      };
    }
    case 'LOAD_PICKUPTUTOR_SUCCESS': {
      return {
        ...state,
        pickupTutorList: action.payload,
      };
    }
    case 'LOAD_PICKUPOUTSOURCE_SUCCESS': {
      return {
        ...state,
        pickupOutsourceList: action.payload,
      };
    }
    case 'LOAD_SUCCESS_OUTSOURCE_DEMAND': {
      return {
        ...state,
        successOutsourceList: action.payload,
      };
    }
    case 'LOAD_SUCCESS_TUTOR_DEMAND': {
      return {
        ...state,
        successTutorList: action.payload,
      };
    }
    case 'LOAD_POPULARCATS_HOME': {
      return {
        ...state,
        gigDemandPopularCats: action.payload,
      };
    }
    default:
      return state;
  }
};
export default commonReducer;
