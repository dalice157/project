const initState = {
    area: [],
};

export default function (state = initState, action) {
    switch (action.type) {
        case 'LOAD_STATIC_AREA_SUCCESS': {
            return {
                ...state,
                area: action.payload,
            };
        }
        case 'LOAD_STATIC_INDUSTRY_SUCCESS': {
            return {
                ...state,
                industry: action.payload,
            };
        }
        case 'SEND_VERIFY_SMS_SUCCESS': {
            return {
                ...state,
                verifySMS: action.payload
            };
        }
        default:
            return state;
    }
}