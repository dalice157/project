import { message } from 'antd';
import { setCookie } from '../util/cookieUtil';
import sysMsg from '../util/messageUtil.js';
import {
  partnerCountData, moneyData, defaultMoneyData, demandTypes, demandOrderTXStatus,
} from '../config/selectData';


const initState = {
  initialCaseForm: {
    // 案件資料
    demandCategory: [],
    title: '',
    unit: null,
    minPrice: null,
    maxPrice: null,
    placeType: 'yes',
    assignPlace: {
      des: null,
      no: null,
    },
    partnerCount: partnerCountData[0].value,
    desc: '',
    educationalStage: '',
    // 使用者資料
    name: '',
    sex: '',
    cellphone: '',
    telArea: '',
    tel: '',
    email: '',
    contactTimeBegin: null,
    contactTimeEnd: null,
    saveDemandResult: {
      success: false,
      data: {
        demandId: '',
        basicId: '',
      },
      message: '',
    },
    otherContactWay: '',
    spec: false,
    // 家教
    classEveryWeekDay: [],
    classEveryWeekHourBegin: null,
    classEveryWeekHourEnd: null,
    classFrequencyHour: null,
    classFrequencyTime: null,
    classFrequencyUnit: null,
    classPlace: [],
    classDuration: null,
    classWay: null,
    jobOccupation: [],
    educationalGrade: null,
    studentSex: null,
    studentTotal: partnerCountData[0].value,
    experience: null,
    character: null,
  },
  defaultDemanderForm: {
    cellphoneRecord: {
      basicId: 0,
      cellphone: '',
      certificate: false,
      frequency: 0,
    },
    telephoneRecord: {
      basicId: 0,
      tel: '',
      telArea: '',
      certificate: false,
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
    demandContactDTO: {
      cellphone: '',
      email: '',
      name: '',
      other: '',
      sex: '',
      tel: '',
      telArea: '',
    },
  },
  lists: null,
  modify: {},
  activate: {},
  paid: null,
  close: {},
  review: {},
  extend: {
    data: {
      demandTitle: '',
      expireDate: '',
    },
  },
  isLoadingDemandStep2: true,
  isLoadingDemandList: true,
  demanderInfo: {},
  demandTitle: {},
  tableList: {
    cursor: null,
    data: [],
    gigTitleList: [],
    loading: {
      isLoadingList: true,
      isLoadingMoreList: false,
      isLoadingAgreeCommunication: false,
      isLoadingReportCooperation: false,
      isLoadingConfirmCooperation: false,
      isLoadingEvaluateTopper: false,
      isLoadingGigTitle: false,
    },
  },
};

const demandReducer = (state = initState, action) => {
  switch (action.type) {
    case 'INITIAL_CASEFORM_DATA': {
      return {
        ...state,
        initialCaseForm: {
          // 案件資料
          demandCategory: [],
          title: '',
          unit: null,
          minPrice: null,
          maxPrice: null,
          placeType: 'yes',
          assignPlace: {
            des: null,
            no: null,
          },
          partnerCount: partnerCountData[0].value,
          desc: '',
          educationalStage: '',
          // 使用者資料
          name: '',
          sex: '',
          cellphone: '',
          telArea: '',
          tel: '',
          email: '',
          contactTimeBegin: null,
          contactTimeEnd: null,
          saveDemandResult: {
            success: false,
            data: {
              demandId: '',
              basicId: '',
            },
            message: '',
          },
          otherContactWay: '',
          spec: false,
          // 家教
          classEveryWeekDay: [],
          classEveryWeekHourBegin: null,
          classEveryWeekHourEnd: null,
          classFrequencyHour: null,
          classFrequencyTime: null,
          classFrequencyUnit: null,
          classPlace: [],
          classDuration: null,
          classWay: null,
          jobOccupation: [],
          educationalGrade: null,
          studentSex: null,
          studentTotal: partnerCountData[0].value,
          experience: null,
          character: null,
        },
        defaultDemanderForm: {
          cellphoneRecord: {
            basicId: 0,
            cellphone: '',
            certificate: false,
            frequency: 0,
          },
          telephoneRecord: {
            basicId: 0,
            tel: '',
            telArea: '',
            certificate: false,
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
          demandContactDTO: {
            cellphone: '',
            email: '',
            name: '',
            other: '',
            sex: '',
            tel: '',
            telArea: '',
          },
        },
      };
    }
    case 'LOAD_SAVED_DEMAND_SUCCESS': {
      const { payload } = action;
      const {
        demandCategory, title, unit, minPrice, maxPrice, assignPlace, partnerCount, desc, educationalStage, character, demandTutorInfo, demandOutsourceInfo, demandContactDTO, solution,
      } = payload;
      const {
        // 會員資料
        cellphone, email, name, other, sex, tel, telArea, contactTimeBegin, contactTimeEnd, displayOther, displayCellphone, displayTel,
      } = demandContactDTO;
      const placeType = Array.isArray(assignPlace) && assignPlace.length > 0 ? 'yes' : 'no';
      const updateBody = {
      //  案件資料
        demandCategory,
        title,
        unit,
        minPrice,
        maxPrice,
        placeType,
        assignPlace,
        partnerCount,
        desc,
        educationalStage,
        // 使用者資料
        name,
        sex,
        cellphone,
        telArea,
        tel,
        email,
        otherContactWay: other,
        contactTime: `${contactTimeBegin}-${contactTimeEnd}`,
        contactTimeBegin,
        contactTimeEnd,
        hideOtherContactWay: !displayOther,
        hideTelephone: !displayTel,
        hideCellphone: !displayCellphone,
        solution,
      };

      if (String(character) === demandTypes.tutor) {
        return {
          ...state,
          initialCaseForm: {
            ...state.initialCaseForm,
            ...updateBody,
            ...demandTutorInfo,
            character,
          },
          saveDemand: payload,
        };
      }
      return {
        ...state,
        initialCaseForm: {
          ...state.initialCaseForm,
          ...updateBody,
          ...demandOutsourceInfo,
          character,
        },
        saveDemand: payload,
      };
    }
    case 'UPDATE_DEMANDFORM_IN_CASEFORM': {
      const { demandType } = action.payload;
      if (demandType === demandTypes.tutor) {
        return {
          ...state,
          initialCaseForm: {
            ...state.initialCaseForm,
            demandCategory: [],
            unit: moneyData[1].value,
            minPrice: defaultMoneyData.minHourRate,
            maxPrice: defaultMoneyData.minHourRate,
          },
        };
      }
      return {
        ...state,
        initialCaseForm: {
          ...state.initialCaseForm,
          demandCategory: [],
          unit: moneyData[0].value,
          minPrice: null,
          maxPrice: null,
        },
      };
    }
    case 'REQUEST_CHECK_DEMANDER_ACCOUNT': {
      return state;
    }
    case 'CHECK_DEMANDER_ACCOUNT_SUCCESS': {
      return {
        ...state,
        paid: action.payload.data.throwBillingRequest,
      };
    }
    case 'FAILURE_CHECK_DEMANDER_ACCOUNT': {
      sysMsg(action, true);
      return state;
    }
    case 'REQUEST_LOAD_ACCOUNT_INFO': {
      return {
        ...state,
        isLoadingDemandStep2: true,
      };
    }
    case 'LOAD_ACCOUNT_INFO_SUCCESS': {
      return {
        ...state,
        defaultDemanderForm: action.payload,
        isLoadingDemandStep2: false,
      };
    }
    case 'FAILURE_LOAD_ACCOUNT_INFO': {
      sysMsg(action, true);
      return state;
    }
    case 'LOAD_DEFAULT_DEMAND_FORM': {
      return {
        ...state,
        defaultDemanderForm: action.payload,
      };
    }
    case 'REQUEST_LOAD_DEMAND_LIST': {
      return {
        ...state,
        isLoadingDemandList: true,
      };
    }
    case 'LOAD_DEMAND_LIST_SUCCESS': {
      return {
        ...state,
        lists: action.payload,
        isLoadingDemandList: false,
      };
    }
    case 'FAILURE_LOAD_DEMAND_LIST': {
      sysMsg(action, true);
      return {
        ...state,
        isLoadingDemandList: false,
      };
    }
    case 'FILTER_DEMAND_LIST_SUCCESS': {
      return {
        ...state,
        lists: action.payload,
        isLoadingDemandList: false,
      };
    }
    case 'MODIFY_DEMAND_SUCCESS': {
      message.success('案件修改成功');
      return {
        ...state,
        saveDemand: action.payload,
      };
    }
    case 'FAILURE_MODIFY_DEMAND': {
      sysMsg(action, true);
      return state;
    }
    case 'REQUEST_SAVE_DEMAND': {
      return state;
    }
    case 'SAVE_DEMAND_SUCCESS': {
      // step1, 防止使用者reload step2，導致無demandId，當天有效
      const { demandId } = action.payload.data;
      setCookie('demandId', demandId, 1);
      return {
        ...state,
        saveDemand: action.payload,
      };
    }
    case 'FAILURE_SAVE_DEMAND': {
      sysMsg(action, true);
      return state;
    }
    case 'ACTIVATE_DEMAND_DEMANDER_SUCCESS': {
      return {
        ...state,
        activate: action.payload,
      };
    }
    case 'REQUEST_PAID_SUBMIT': {
      return state;
    }
    case 'PAID_SUBMIT_SUCCESS': {
      return {
        ...state,
        paid: action.payload,
      };
    }
    case 'FAILURE_PAID_SUBMIT': {
      return state;
    }
    case 'DEMAND_CLOSE_SUBMIT': {
      return {
        ...state,
        close: action.payload,
      };
    }
    case 'REVIEW_TOPPER_SUCCESS': {
      return {
        ...state,
        review: action.payload,
      };
    }
    case 'DEMAND_EXTEND_SUBMIT': {
      return {
        extend: action.payload,
      };
    }
    case 'REQUEST_INVITEES_LIST': {
      return {
        ...state,
        tableList: {
          ...state.tableList,
          loading: {
            ...state.tableList.loading,
            isLoadingList: true,
          },
        },
      };
    }
    case 'LOAD_INVITEES_LIST_SUCCESS': {
      return {
        ...state,
        tableList: {
          ...state.tableList,
          ...action.payload,
          loading: {
            ...state.tableList.loading,
            isLoadingList: false,
          },
        },
      };
    }
    case 'REQUEST_APPEND_INVITEES_LIST': {
      return {
        ...state,
        tableList: {
          ...state.tableList,
          loading: {
            ...state.tableList.loading,
            isLoadingMoreList: true,
          },
        },
      };
    }
    case 'APPEND_INVITEES_LIST_SUCCESS': {
      return {
        ...state,
        tableList: {
          ...state.tableList,
          ...action.payload,
          data: [...state.tableList.data, ...action.payload.data],
          loading: {
            ...state.tableList.loading,
            isLoadingMoreList: false,
          },
        },
      };
    }
    case 'REQUEST_CANDIDATE_LIST': {
      return {
        ...state,
        tableList: {
          ...state.tableList,
          loading: {
            ...state.tableList.loading,
            isLoadingList: true,
          },
        },
      };
    }
    case 'LOAD_CANDIDATE_LIST_SUCCESS': {
      return {
        ...state,
        tableList: {
          ...state.tableList,
          ...action.payload,
          loading: {
            ...state.tableList.loading,
            isLoadingList: false,
          },
        },
      };
    }
    case 'REQUEST_APPEND_CANDIDATE_LIST': {
      return {
        ...state,
        tableList: {
          ...state.tableList,
          loading: {
            ...state.tableList.loading,
            isLoadingMoreList: true,
          },
        },
      };
    }
    case 'APPEND_CANDIDATE_LIST_SUCCESS': {
      return {
        ...state,
        tableList: {
          ...state.tableList,
          ...action.payload,
          data: [...state.tableList.data, ...action.payload.data],
          loading: {
            ...state.tableList.loading,
            isLoadingMoreList: false,
          },
        },
      };
    }
    case 'REQUEST_AGREE_COMMUNICATION': {
      return {
        ...state,
        tableList: {
          ...state.tableList,
          loading: {
            ...state.tableList.loading,
            isLoadingAgreeCommunication: action.payload.topperId,
          },
        },
      };
    }
    case 'AGREE_COMMUNICATION_SUCCESS': {
      message.success('同意溝通成功');
      const { topperId } = action.payload.data.dealMeta;
      const result = state.tableList.data.map((gig) => {
        if (gig.dealMeta && gig.dealMeta.topperId === topperId) {
          return { ...gig, dealMeta: action.payload.data.dealMeta };
        }
        return gig;
      });
      return {
        ...state,
        tableList: {
          ...state.tableList,
          data: result,
          loading: {
            ...state.tableList.loading,
            isLoadingAgreeCommunication: false,
          },
        },
      };
    }
    case 'REQUEST_REPORT_COOPERATION': {
      return {
        ...state,
        tableList: {
          ...state.tableList,
          loading: {
            ...state.tableList.loading,
            isLoadingReportCooperation: action.payload.topperId,
          },
        },
      };
    }
    case 'REPORT_COOPERATION_SUCCESS': {
      message.success('邀請合作成功');
      const { topperId } = action.payload.data.dealMeta;
      const result = state.tableList.data.map((gig) => {
        if (gig.dealMeta && gig.dealMeta.topperId === topperId) {
          return { ...gig, dealMeta: action.payload.data.dealMeta };
        }
        return gig;
      });
      return {
        ...state,
        tableList: {
          ...state.tableList,
          data: result,
          loading: {
            ...state.tableList.loading,
            isLoadingReportCooperation: false,
          },
        },
      };
    }
    case 'REQUEST_CONFIRM_COOPERATION': {
      return {
        ...state,
        tableList: {
          ...state.tableList,
          loading: {
            ...state.tableList.loading,
            isLoadingConfirmCooperation: action.payload.topperId,
          },
        },
      };
    }
    case 'CONFIRM_COOPERATION_SUCCESS': {
      message.success('確認合作成功');
      const { topperId } = action.payload.data.dealMeta;
      const result = state.tableList.data.map((gig) => {
        if (gig.dealMeta && gig.dealMeta.topperId === topperId) {
          return { ...gig, dealMeta: action.payload.data.dealMeta };
        }
        return gig;
      });
      return {
        ...state,
        tableList: {
          ...state.tableList,
          data: result,
          loading: {
            ...state.tableList.loading,
            isLoadingReportCooperation: false,
          },
        },
      };
    }
    case 'REQUEST_EVALUATE_TOPPER': {
      return {
        ...state,
        tableList: {
          ...state.tableList,
          loading: {
            ...state.tableList.loading,
            isLoadingEvaluateTopper: action.payload.topperId,
          },
        },
      };
    }
    case 'EVALUATE_TOPPER_SUCCESS': {
      message.success('已完成評價！');
      const { topperId } = action.payload.data.dealMeta;
      const result = state.tableList.data.map((gig) => {
        if (gig.dealMeta && gig.dealMeta.topperId === topperId) {
          return { ...gig, dealMeta: action.payload.data.dealMeta };
        }
        return gig;
      });
      return {
        ...state,
        tableList: {
          ...state.tableList,
          data: result,
          loading: {
            ...state.tableList.loading,
            isLoadingEvaluateTopper: false,
          },
        },
      };
    }
    case 'REQUEST_GIG_TITLE_LIST': {
      return {
        ...state,
        tableList: {
          ...state.tableList,
          loading: {
            ...state.tableList.loading,
            isLoadingGigTitle: action.payload.topperId,
          },
        },
      };
    }
    case 'GIG_TITLE_LIST_SUCCESS': {
      return {
        ...state,
        tableList: {
          ...state.tableList,
          gigTitleList: action.payload.data.gigTitleList,
          loading: {
            ...state.tableList.loading,
            isLoadingGigTitle: false,
          },
        },
      };
    }
    case 'LOAD_DEMAND_TITLE_SUCCESS': {
      return {
        ...state,
        demandTitle: action.payload,
      };
    }
    case 'DEMAND_PHONE_DISPLAY': {
      const { data } = state.lists;
      const { phoneDisplaying, demandId } = action.payload.data;
      const updateIndex = data.findIndex(demand => demand.demandId === demandId);
      const updateData = Object.assign({}, data[updateIndex]);
      const {
        depositeStatus, confirmedTopper, negotiatedTopper, reviewedTopper,
      } = updateData;
      const numOfConfirmedTopper = Array.isArray(confirmedTopper) && confirmedTopper.length;
      const numOfNegotiatedTopper = Array.isArray(negotiatedTopper) && negotiatedTopper.length;
      const numOfReviewedTopper = Array.isArray(reviewedTopper) && reviewedTopper.length;
      const numOfTotalTopper = numOfConfirmedTopper + numOfReviewedTopper + numOfNegotiatedTopper;
      const canChangPhoneDisplay = depositeStatus === demandOrderTXStatus.depositeStatus.FREE ? numOfTotalTopper >= 10 : updateData?.canChangPhoneDisplay;
      Object.assign(data[updateIndex], {
        ...updateData,
        phoneDisplaying,
        canChangPhoneDisplay,
      });
      return {
        ...state,
        lists: {
          ...state.lists,
          data,
        },
      };
    }
    default:
      return state;
  }
};

export default demandReducer;
