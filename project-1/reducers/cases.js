import sysMsg from '../util/messageUtil.js';

const initState = {
  paged: {
    data: [],
    facets: {},
    fileMap: {},
    start: 0,
    total: 0
  },
  caseListLoading: false,
  applier: {},
  bargainingPower: {},
  contactsData: {
    demandContact: {},
  },
  chatMetaData: {},
  gig: null,
};

const casesReducer = (state = initState, action) => {
  switch (action.type) {
    case 'REQUEST_CASELIST': {
      return {
        ...state,
        caseListLoading: true,
      };
    }
    case 'LOAD_CASELIST_SUCCESS': {
      return {
        ...state,
        paged: action.payload ? action.payload : state.paged,
        caseListLoading: false,
      };
    }
    case 'ADD_APPLIER_SUBMIT_SUCCESS': {
      return {
        ...state,
        applier: action.payload,
      };
    }
    case 'ADD_APPLIER_SUBMIT_FAILURE': {
      sysMsg(action, true);
      return state;
    }
    case 'LOAD_BARGAINING_POWER_SUCCESS': {
      return {
        ...state,
        bargainingPower: action.payload,
      };
    }
    case 'GET_CONTACTS_SUCCESS': {
      return {
        ...state,
        contactsData: action.payload,
      };
    }
    case 'GET_CONTACTS_FAILURE': {
      sysMsg(action, true);
      return state;
    }
    case 'MAKE_UP_CHAT_META_SUCCESS': {
      return {
        ...state,
        chatMetaData: action.payload
      };
    }
    case 'LOAD_GIG_DATA': {
      return {
        ...state,
        gig: action.payload,
      };
    }
    case 'LOAD_GIG_DATA_FAILURE': {
      sysMsg(action, true);
      return state;
    }
    default:
      return state;
  }
};

export default casesReducer;
