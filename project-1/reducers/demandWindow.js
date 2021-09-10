
const initState = {
  demandList: [],
  isPublished: false
};

const demandWindowReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOAD_DEMAND_WINDOW_LIST': {
      let demandList = action.payload || [];
      if (demandList.length !== 3) {
        return state;
      }
      demandList = demandList.map((demand) => {
        if (demand.title.length > 15) {
          demand.title = demand.title.substring(0, 15) + '...';
        }
        if (demand.desc.length > 50) {
          demand.desc = demand.desc.substring(0, 50) + '...';
        }
        return demand;
      });
      return {
        ...state,
        demandList: demandList,
        isPublished: true
      };
    }
    default: {
      return state;
    }
  }
};

export default demandWindowReducer;
