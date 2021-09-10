const initState = {
};

const serviceItemsReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOAD_SERVICE_SUCCESS': {
      return {
        ...state,
        ...action.payload
      };
    }

    default:
      return state;
  }
};

export default serviceItemsReducer;
