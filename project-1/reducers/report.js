const initState = {
  reportRecord: {
    id: null,
    message: '',
    data: {
      isSexualHarassment: 'false',
      recId: 'null'
    },
    success: true
  },
  otherReportRecord: {
    id: null,
    message: '',
    data: {
      isSexualHarassment: 'false',
      recId: 'null'
    },
    success: true
  },
  reportDemandList: {
    demandList: [],
    demanderId: 0,
    topperId: 0,
    topperName: '',
  },
  reportHim: {
    data: {},
    id: 0,
    message: '',
    success: false,
  },
};

const reportReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOAD_REPORT_RECORD_SUCCESS': {
      return {
        ...state,
        reportRecord: action.payload,
      };
    }
    case 'LOAD_OTHER_REPORT_RECORD_SUCCESS': {
      return {
        ...state,
        otherReportRecord: action.payload,
      };
    }
    case 'LOAD_REPORT_DEMAND_LIST_SUCCESS': {
      return {
        ...state,
        reportDemandList: action.payload,
      };
    }
    case 'REPORT_HIM_SUCCESS': {
      return {
        ...state,
        reportHim: action.payload,
      };
    }
    default:
      return state;
  }
};
export default reportReducer;
