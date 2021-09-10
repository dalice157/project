// import sysMsg from '../util/messageUtil.js';
const initData = {
    violation: {
        yyyyMM: '',
        recordId: '',
        reporter: '',
        reporterName: '',
        reporterCellphone: '',
        reporterEmail: '',
        targetId: '',
        targetName: '',
        targetCellphone: '',
        targetEmail: '',
        targetDemandId: '無',
        targetDemandTitle: '無',
        targetType: '',
        causeType: '',
        handleStatus: '',
        causeBody: {
            causeDesc: '',
            attachment: [
                '',
                ''
            ]
        },
        staff: '',
        lastMemo: '',
        createDate: '',
        memoList: null
    }
}
export default function (state = initData, action) {
    switch (action.type) {
        case 'LOAD_VIOLATION_LIST_SUCCESS': {
            return {
                ...state,
                violationList: action.payload
            };
        }
        case 'LOAD_VIOLATION_SUCCESS': {
            return {
                ...state,
                violation: action.payload
            };
        }
        case 'UPDATE_VIOLATION_MEMO_SUCCESS': {
            alert("修改成功");
            window.location.reload();
            return state;
        }
        default:
            return state;
    }
}