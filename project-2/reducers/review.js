import { message as antdMessage } from 'antd';
import dayjs from 'dayjs';

const initData = {
  reviewListData: [],
  initReviewValues: {
    comment: '',
    commentDate: dayjs().format('YYYY/MM/DD'),
    demandId: '',
    demandTitle: '',
    demanderId: 0,
    demander: '',
    demanderName: '',
    demanderSex: '1',
    display: true,
    currentGigTitle: '',
    gigId: '',
    gigTitle: '',
    memo: '',
    ranking1: 0,
    ranking2: 0,
    ranking3: 0,
    reviewId: 0,
    topperId: 0,
  },
  titleNames: {
    nameTitle: null,
    demandTitle: null,
  },
  topperGigs: null,
  reviewForm: null,
  displayToggle: null,
  updateReviewList: null,
};

export default function (state = initData, action) {
  switch (action.type) {
    case 'LOAD_REVIEW_ITEM_LIST_SUCCESS': {
      antdMessage.success('載入單一高手評價列表成功');
      return {
        ...state,
        reviewListData: action.payload.data,
      };
    }
    case 'WRITE_REVIEW_ITEM_LIST_SUCCESS': {
      antdMessage.success('高手評價送出成功');
      return {
        ...state,
        reviewListData: action.payload.data,
      };
    }
    case 'LOAD_DELETE_REMOVE_ITEM_SUCCESS': {
      antdMessage.success('刪除評價成功');
      return {
        ...state,
      };
    }

    case 'LOAD_DEMANDER_NAMETITLE_SUCCESS': {
      return {
        ...state,
        titleNames: {
          ...state.titleNames,
          nameTitle: action.payload.data.demanderName,
        },
      };
    }
    case 'LOAD_DEMAND_TITLE_SUCCESS': {
      return {
        ...state,
        titleNames: {
          ...state.titleNames,
          demandTitle: action.payload.data.demandTitle,
        },
      };
    }
    case 'LOAD_TOPPER_GIGS_SUCCESS': {
      return {
        ...state,
        topperGigs: action.payload,
      };
    }
    case 'ADD_REVIEW_FORM_SUCCESS': {
      return {
        ...state,
        reviewForm: action.payload,
      };
    }
    case 'SEND_DISPLAY_TOGGLE_SUCCESS': {
      return {
        ...state,
        displayToggle: action.payload,
      };
    }
    case 'UPDATE_REVIEW_FORM_SUCCESS': {
      return {
        ...state,
        updateReviewList: action.payload,
      };
    }
    case 'INITIAL_REVIEW_FORM': {
      const {
        demanderId, ranking1, ranking2, ranking3, topperId, gigId, gigTitle,
      } = action.payload;
      return {
        ...state,
        initReviewValues: {
          ...action.payload,
          gigId: gigId === 'Gig-Other' ? '請選擇服務項目' : gigId,
          gigTitle: gigId === 'Gig-Other' ? '請選擇服務項目' : gigTitle,
          demanderId: Number(demanderId),
          memo: '',
          ranking1: Number(ranking1),
          ranking2: Number(ranking2),
          ranking3: Number(ranking3),
          topperId: Number(topperId),
        },
      };
    }
    default:
      return state;
  }
}
