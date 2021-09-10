const initState = {
  payDataResuest: null,
  tx: null
};

const payReducer = (state = initState, action) => {
  switch (action.type) {
    case 'PAY_FORM_SUBMIT': {
      return {
        ...state,
        payDataResuest: action.payload
      };
    }

    case 'BILL_PAYMENT_SUCCESS': {
      return {
        ...state,
        tx: action.payload
      };
    }

    default:
      return state;
  }
};

export default payReducer;
