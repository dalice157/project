const initState = {
  profile: {
    firstName: '',
    familyName: '',
    sex: '',
    birthday: '',
    postNum: '',
    address: '',
    identityType: null,
    identity: '',
    invoice: null,
    emailInfo: {
      email: '',
      isMain: '',
      isVerified: '',
    },
    telArea: '',
    tel: '',
    cellphoneRecord: {
      basicId: 0,
      cellphone: '',
      certificate: false,
      frequency: 0,
    },
    roleType: 0,
    sourceList: null,
  },
  gigs: {
    fileMap: null,
    total: null,
    start: null,
    cursor: null,
    facets: null,
    data: [],
  },
  saveGigs: {
    id: 0,
    message: '',
    success: false,
  },
  delGig: {
    id: 0,
    message: '',
    success: false,
  },
  import: {},
  importSource: {
    sourceList: [],
    plusList: [],
  },
  caseDeal: {
    error: null,
    success: 'true',
    showDealInfo: false,
    data: [],
    /**
     * [{
     *   "source": "outsource",
     *   "sourceDesc": "104外包網",
     *   "reviewItems": 2,
     *   "dealNum": 5,
     *   "reviewScore": 4
     * }]
     */
  },
  /**
   * 若符合取消條件則回傳過往評價資料
   * pastYear:已註冊y年
   * pastMonth:已註冊n月
   * dealCount:合作數
   * reviewCount:評價數
   * reviewAvgScore:評價平均分數
   */
  getCancel: {
    pastYear: '0',
    pastMonth: '0',
    reviewCount: '0',
    dealCount: '0',
    reviewAvgScore: null,
    isTopperHaveCooperatingDemand: '', // true or fasle
    isViolation: '', // true or fasle
  },
  putCancel: {
    data: {},
  },
  plusPublish: {
    id: '',
    message: '',
    success: false,
  },
  plusShare: {
    data: {
      isAskBoxOpen: 'false',
      pid: '',
    },
    id: '',
    message: '',
    success: false,
  },
  imUnread: {},
  chargeTopperFree: null,
  yolkMember: {
    data: {},
    id: 0,
    message: '',
    success: false,
  },
  publishCheck: [],
  enableForm: {
    employeeCount: 0,
    emailInfo: {
      email: '',
      isVerified: 'false',
    },
    identityType: 0,
    jobTitle: 0,
    roleType: 0,
    subscribeEpaperId: [],
    familyName: '',
    firstName: '',
    identity: '',
    industry: {
      des: '',
      no: '',
    },
    invoice: null,
    address: '',
    birthday: '',
    sex: '1',
    cellphone: '',
    tel: '',
    telArea: '',
    chosenRole: null,
    companyName: null,
  },
  saveTopForm: {
    data: {},
    id: 0,
    message: '',
    success: true,
  },
  payInfoData: {
    planType: 'top',
    planOption: {},
  },
  payOrderInfo: {
    carrierType: '',
    cellphone: '',
    estimateEndDate: '1911/1/1',
    estimateStartDate: '1911/1/1',
    invoiceAddress: '',
    invoiceTitle: '',
    invoiceType: '',
    name: '',
    planType: 'outsource',
    price: 0,
    productNo: 'MISC2010000009',
    tel: '',
    telArea: '',
    idTokenHash: '',
    orderHashList: [
      {
        orderHash: '',
        orderId: '0',
      },
    ],
  },
  payOrderReceiverInfo: {},
  testUser: false,
  invoiceStatus: {},
  paidPlanInfo: {
    paidList: [{
      orderType: 3,
      planType: 'top',
      productNo: 'MISC2010000009',
    }],
    isLoading: true,
  },
  availableOnDemands: {
    tutorDemandCount: 0,
    allDemandCount: 0,
    outsourceDemandCount: 0,
  },
  preUpgradePlanInfo: {
    acName: '',
    companyName: '',
    invoiceAddress: '',
    invoiceNum: '',
    invoiceTitle: '',
    postNum: {
      des: '',
      no: '',
    },
    currentPlan: {
      consumeDays: 0,
      estimateEndDate: '1911/1/1',
      price: 0,
      productNo: 'MISC2010000009',
      startDate: '1911/1/1',
    },
    upgradePlan: {
      estimateEndDate: '1911/1/1',
      price: 0,
      productNo: 'MISC2010000009',
      remainingDays: 0,
      startDate: '1911/1/1',
    },
  },
};

const basicReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOAD_TEST_USER': {
      return {
        ...state,
        testUser: action.payload,
      };
    }
    case 'SEND_PAYMENT_ORDER_FAILURE': {
      return state;
    }
    case 'LOAD_DEAFULT_PROFILE_SUCCESS': {
      return {
        ...state,
        profile: action.payload,
      };
    }

    case 'LOAD_GIGS_SUCCESS': {
      return {
        ...state,
        gigs: action.payload,
      };
    }
    case 'SAVE_GIGS_SUCCESS': {
      return {
        ...state,
        saveGigs: action.payload,
      };
    }

    case 'DELETE_GIG_SUCCESS': {
      return {
        ...state,
        delGig: action.payload,
      };
    }


    case 'IMPORT_PROFILE_SUCCESS': {
      return {
        ...state,
        import: action.payload,
      };
    }

    case 'LOAD_IMPORT_SOURCE_LIST_SUCCESS': {
      return {
        ...state,
        importSource: action.payload,
      };
    }

    case 'LOAD_CASE_DEAL_SUCCESS': {
      return {
        ...state,
        caseDeal: action.payload,
      };
    }

    case 'BASIC_GET_CANCEL': {
      return {
        ...state,
        getCancel: action.payload,
      };
    }

    case 'BASIC_PUT_CANCEL': {
      return {
        ...state,
        putCancel: action.payload,
      };
    }

    case 'BASIC_SET_PLUS_PUBLISH_STATUS': {
      return {
        ...state,
        plusPublish: action.payload,
      };
    }

    case 'BASIC_GET_PLUS_SHARE': {
      return {
        ...state,
        plusShare: action.payload || state.plusShare,
      };
    }

    case 'BASIC_CHARGE_TOPPER_FREE': {
      return {
        ...state,
        chargeTopperFree: action.payload,
      };
    }

    case 'BASIC_YOLK_MEMBER_BEEN_TO_EDIT': {
      return {
        ...state,
        yolkMember: action.payload,
      };
    }

    case 'BASIC_GET_PUBLISH_CHECK': {
      return {
        ...state,
        publishCheck: action.payload,
      };
    }

    case 'BASIC_GET_FORM_DEFAULT': {
      return {
        ...state,
        enableForm: action.payload,
      };
    }

    case 'SAVE_TOP_FORM_SUCCESS': {
      return {
        ...state,
        saveTopForm: action.payload,
      };
    }
    case 'BASIC_GET_PAY_INFO': {
      return {
        ...state,
        payInfoData: action.payload,
      };
    }
    case 'BASIC_GET_PAY_INFO_FAILURE': {
      return state;
    }
    case 'BASIC_GET_PAY_INFO_V2': {
      return {
        ...state,
        payInfoData: action.payload,
      };
    }
    case 'BASIC_GET_PAY_INFO_FAILURE_V2': {
      return state;
    }
    case 'SEND_PAYMENT_ORDER_SUCCESS': {
      return {
        ...state,
        payOrderInfo: action.payload,
      };
    }
    case 'SEND_UPGRADE_ORDER_SUCCESS': {
      return {
        ...state,
        payOrderInfo: action.payload,
      };
    }
    case 'SEND_PAYMENT_ORDER_RECEIVER_SUCCESS': {
      return {
        ...state,
        payOrderReceiverInfo: action.payload,
      };
    }
    case 'CHECK_INVOICE_SUCCESS': {
      return {
        ...state,
        invoiceStatus: action.payload,
      };
    }
    case 'GET_PAID_RECORD_USING': {
      return {
        ...state,
        paidPlanInfo: {
          ...action.payload,
          isLoading: false,
        },
      };
    }
    case 'GET_AVAILABLE_ON_DEMANDS_SUCCESS': {
      return {
        ...state,
        availableOnDemands: action.payload,
      };
    }
    case 'PRE_UPGRADE_PLAN_INFO_SUCCESS': {
      return {
        ...state,
        preUpgradePlanInfo: action.payload,
      };
    }
    default:
      return state;
  }
};

export default basicReducer;
