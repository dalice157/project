
const initData = {
  memoList: {
    cursor: null,
    data: [],
    facets: {
      memoDao: {
        basicMemo: [],
        gigMemo: [],
        demandMemo: [],
        violationRecordMemo: [],
        reviewMemo: [],
      },
    },
  },
};

export default function (state = initData, action) {
  switch (action.type) {
    case 'LOAD_MEMO_SUCCESS': {
      return {
        ...state,
        memoList: action.payload,
      };
    }
    default:
      return state;
  }
}
