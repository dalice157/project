import { message } from 'antd';

const initState = {
  profileInfo: {
    medal: '0',
    activeInSevenDays: 'false',
  },
  gigDetail: {
    focusGig: {
      gigId: null,
      cats: [],
      catTag: [],
      body: {},
    },
    otherGigIndex: [],
  },
  defaultDemanderForm: {
    cellphoneRecord: {
      basicId: 0,
      cellphone: '',
      certificate: false,
      frequency: 0,
    },
    emailInfo: {
      email: '',
      isMain: '',
      isVerified: '',
    },
    firstName: '',
    familyName: '',
    sex: '',
    identityType: null,
    identity: '',
    invoice: null,
    email: '',
    telArea: '',
    tel: '',
  },
  saveDemand: {
    data: {
      demandId: '',
      basicId: '',
    },
    id: null,
    message: '',
    success: false,
  },
  activate: {},
  paid: null,
  invitableDemands: [],
};

const introductReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOAD_SELF_ACHIEVEMENT_SUCCESS_AUTH': {
      return {
        ...state,
        profileInfo: action.payload,
      };
    }
    case 'LOAD_GIG_DETAIL_SUCCESS_AUTH': {
      return {
        ...state,
        gigDetail: action.payload,
      };
    }
    case 'LOAD_SELF_ACHIEVEMENT_SUCCESS': {
      return {
        ...state,
        profileInfo: action.payload,
      };
    }
    case 'LOAD_GIG_DETAIL_SUCCESS': {
      return {
        ...state,
        gigDetail: action.payload,
      };
    }
    case 'LOAD_INTRODUCT_DEFAULT_DEMAND_FROM': {
      return {
        ...state,
        defaultDemanderForm: action.payload,
      };
    }
    case 'SAVE_INTRODUCT_DEMAND_SUCCESS': {
      return {
        ...state,
        saveDemand: action.payload,
      };
    }
    case 'ACTIVATE_INTRODUCT_DEMANDER_SUCCESS': {
      return {
        ...state,
        activate: action.payload,
      };
    }
    case 'PAID_INTRODUCT_SUBMIT_SUCCESS': {
      return {
        ...state,
        paid: action.payload,
      };
    }
    case 'LOAD_INTRODUCT_INVITABLE_DEMANDS_SUCCESS': {
      return {
        ...state,
        invitableDemands: action.payload,
      };
    }
    case 'ADD_GIG_FROM_INTRODUCT': {
      message.success('已加入收藏');
      return {
        ...state,
        gigDetail: {
          ...state.gigDetail,
          focusGig: {
            ...state.gigDetail.focusGig,
            favoriteId: action.payload.data.favoriteId,
          },
        },
      };
    }

    case 'REMOVE_GIG_FROM_INTRODUCT': {
      message.success('收藏已取消');
      return {
        ...state,
        gigDetail: {
          ...state.gigDetail,
          focusGig: {
            ...state.gigDetail.focusGig,
            favoriteId: null,
          },
        },
      };
    }
    case 'ADD_GIG_OTHER_FROM_INTRODUCT': {
      const gigs = state.gigDetail.otherGigIndex.map((gig) => {
        if (gig.gigId == action.payload.data.gigId) {
          return {
            ...gig,
            favoriteId: action.payload.data.favoriteId,
          };
        }
        return gig;
      });
      message.success('已加入收藏');
      return {
        ...state,
        gigDetail: {
          ...state.gigDetail,
          otherGigIndex: gigs,
        },
      };
    }

    case 'REMOVE_GIG_OTHER_FROM_INTRODUCT': {
      const gigs = state.gigDetail.otherGigIndex.map((gig) => {
        if (gig.gigId == action.payload.data.gigId) {
          return {
            ...gig,
            favoriteId: null,
          };
        }
        return gig;
      });
      message.success('收藏已取消');
      return {
        ...state,
        gigDetail: {
          ...state.gigDetail,
          otherGigIndex: gigs,
        },
      };
    }
    default:
      return state;
  }
};
export default introductReducer;
