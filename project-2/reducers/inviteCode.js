import sysMsg from '../util/messageUtil.js';
const initState = {
    list: [],    
};

export default function (state = initState, action) {
    switch (action.type) {
        case 'LOAD_INVITE_CODE_SUCCESS': {
            return {               
                list: action.payload,
            };
        }
        case 'GET_INVITE_CODE_SUCCESS': {
            return {                
                list: [action.payload],
            };
        }
        case 'CREATE_INVITE_CODE_SUCCESS': {
            sysMsg(action);
            return {                
                list: [action.payload, ...state.list]
            };
        }
        default:
            return state;
    }
}