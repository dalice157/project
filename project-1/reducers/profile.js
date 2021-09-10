const initState = {
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
};

const profileReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOAD_PROFILE_DEFAULT_DEMAND_FROM': {
      return {
        ...state,
        defaultDemanderForm: action.payload,
      };
    }
    case 'SAVE_PROFILE_DEMAND_SUCCESS': {
      return {
        ...state,
        saveDemand: action.payload,
      };
    }
    case 'ACTIVATE_PROFILE_DEMANDER_SUCCESS': {
      return {
        ...state,
        activate: action.payload,
      };
    }
    case 'PAID_PROGILE_SUBMIT_SUCCESS': {
      return {
        ...state,
        paid: action.payload,
      };
    }
    default:
      return state;
  }
};
export default profileReducer;
