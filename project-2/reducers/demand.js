import { message as antdMessage } from 'antd';
import sysMsg from '../util/messageUtil.js';

const initData = {
  demandData: {
    demandDAO: {
      basicId: null,
      demandId: '',
      demandCategory: [],
      demandBody: {
        title: '',
        desc: '',
        assignPlace: {
          areaDesc: '',
          areaNo: ''
        },
        unit: 0,
        minPrice: 0,
        maxPrice: 0,
        partnerCount: 1,
      },
      onlineStatusOption: 0,
      paymentId: null,
      violation: false,
      createDate: null,
      onlineDate: null,
      offDate: null,
      offReason: null,
      educationalStage: null,
      character: null,
      demandTutorInfo: {
        experience: null,
        classEveryWeekDay: [],
        classEveryWeekHourBegin: null,
        classEveryWeekHourEnd: null,
        classFrequencyHour: null,
        classFrequencyTime: null,
        classFrequencyUnit: null,
        jobOccupation: [],
        studentGrade: null,
        studentSex: null,
        studentTotal: null,
      },
      demandOutsourceInfo: {
        experience: null,
        jobOccupation: [],
      }
    }
  },
  demandWindowId: {
    // debug data
    // demandId1: '8971523911927555',
    // demandId2: '8808185352005702',
    // demandId3: '-8926792978483326',
    demandId1: '',
    demandId2: '',
    demandId3: ''
  },
  demandWindowData: {
    leftDemand: {
      title: '',
      desc: '',
      demandId: '',
      price: [0, 0],
      unit: 0
    },
    middleDemand: {
      title: '',
      desc: '',
      demandId: '',
      price: [0, 0],
      unit: 0
    },
    rightDemand: {
      title: '',
      desc: '',
      demandId: '',
      price: [0, 0],
      unit: 0
    }
  },
  // multipleSearch schema
  multipleSearchData: {
    // "time": {
    //     "type": 0,
    //     "month": "2020-01-14T01:45:22.671Z",
    //     "days": [
    //         "",
    //         ""
    //       ]
    //     },
    //     "demandOptions": {
    //       "allOptions": "全部",
    //       "tutorOptions": null,
    //       "partnerOptions": null
    //     },
    //     "publicationStatus": "全部",
    //     "depositStatus": "全部",
    //     "reportStatus": "全部"
  },
  // demandList schema
  demandList: [
    // {
    //   "basicId": 0,
    //   "confirmedCount": 0,
    //   "createDate": "2020-02-15T09:23:16.186Z",
    //   "demandCategory": [
    //     "string"
    //   ],
    //   "demandId": "string",
    //   "demandTitle": "string",
    //   "depositResource": "string",
    //   "email": "string",
    //   "emailVerifyStatus": true,
    //   "familyName": "string",
    //   "firstName": "string",
    //   "lastMemo": {
    //     "basicId": 0,
    //     "createDate": "2020-02-15T09:23:16.186Z",
    //     "hostingHandleStatus": 0,
    //     "memo": "string",
    //     "memoSource": "string",
    //     "staff": 0,
    //     "staffHandleStatus": 0
    //   },
    //   "negotiatedCount": 0,
    //   "offDate": "2020-02-15T09:23:16.186Z",
    //   "onlineDate": "2020-02-15T09:23:16.186Z",
    //   "onlineStatus": 0,
    //   "orderApplySource": 0,
    //   "orderMISProcess": 0,
    //   "reviewedCount": 0,
    //   "violation": true
    // }
  ],
  pendingCase: null,
  checklistCase: null,
  demanderDefaultInfo: null,
  expireDateInfo: null
};
export default function (state = initData, action) {
  switch (action.type) {
    case 'LOAD_DEMANDER_DEFAULT_INFO_SUCCESS': {
      return {
        ...state,
        demanderDefaultInfo: action.payload,
      };
    }
    case 'LOAD_DEMAND_MULTIPLE_SEARCH_SUCCESS': {
      antdMessage.success('多條件查詢成功');
      return {
        ...state,
        demandList: action.payload.data,
        cursor: action.payload.cursor,
      };
    }
    case 'LOAD_APPEND_DEMAND_MULTIPLE_SEARCH_SUCCESS': {
      antdMessage.success('多條件查詢成功');
      return {
        ...state,
        demandList: state.demandList.concat(action.payload.data),
        cursor: action.payload.cursor,
      };
    }
    case 'LOAD_DEMAND_WINDOW_SUCCESS': {
      const payload = action.payload;
      return {
        ...state,
        demandWindowData: {
          leftDemand: payload[0],
          middleDemand: payload[1],
          rightDemand: payload[2]
        }
      };
    }
    case 'LOAD_DEMAND_SUCCESS': {
      antdMessage.success('案件載入成功');
      let demandData = action.payload;
      demandData = {
        ...demandData,
        demandDAO: {
          ...demandData.demandDAO,
          demandTutorInfo: demandData.demandDAO.demandTutorInfo
            ? demandData.demandDAO.demandTutorInfo
            : {
              experience: null,
              classEveryWeekDay: [],
              classEveryWeekHourBegin: null,
              classEveryWeekHourEnd: null,
              classFrequencyHour: null,
              classFrequencyTime: null,
              classFrequencyUnit: null,
              jobOccupation: [],
              studentGrade: null,
              studentSex: null,
              studentTotal: null,
            },

          demandOutsourceInfo: demandData.demandDAO.demandOutsourceInfo
            ? demandData.demandDAO.demandOutsourceInfo : {
              experience: null,
              jobOccupation: [],
            },
        }
      };
      return {
        ...state,
        demandData: demandData,
      };
    }
    case 'SAVE_DEMAND_WINDOW_SUCCESS': {
      antdMessage.success('已成功發布到案件櫥窗');
      return state;
    }
    case 'LOAD_DEMAND_WINDOW_ISSUES': {
      const message = action.payload.response.errors.message.replace(/Demand-/g, '');
      alert(message);
      return state;
    }
    case 'SAVE_DEMAND_WINDOW_ISSUES': {
      const message = action.payload.response.errors.message;
      alert(message);
      return state;
    }
    case 'LOAD_DEMAND_LIST_SUCCESS': {
      antdMessage.success('單一條件查詢成功');
      return {
        ...state,
        demandList: action.payload,
      };
    }
    case 'INSERT_DEMAND_MEMO_SUCCESS': {
      return state;
    }
    case 'LOAD_DEMAND_MULTIPLE_SEARCH_ISSUES': {
      antdMessage.error('多條件條件查詢失敗');
      return state;
    }
    case 'LOAD_DEMAND_LIST_ISSUES': {
      antdMessage.error('單一條件條件查詢失敗');
      return state;
    }
    case 'LOAD_PENDING_DEMAND_LIST_SUCCESS': {
      return {
        ...state,
        pendingCase: action.payload.preCursor ? [...state.pendingCase, ...action.payload.data] : action.payload.data,
        next: action.payload.cursor
      };
    }
    case 'LOAD_CHECK_DEMAND_LIST_SUCCESS': {
      return {
        ...state,
        checklistCase: action.payload.preCursor ? [...state.checklistCase, ...action.payload.data] : action.payload.data,
        next: action.payload.cursor
      };
    }
    case 'UPDATE_DEMAND_EXPRIE_SUCCESS': {
      return {
        ...state,
        expireDateInfo: action.payload
      };
    }
    case 'UPDATE_DEMAND_EXPRIE_FAILURE': {
      sysMsg(action);
      return state;
    }
    default:
      return state;
  }
}
