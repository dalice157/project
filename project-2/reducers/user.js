
const initUser = {
    id: 0,
    name: ''
}

export default function (state = initUser, action) {
    switch (action.type) {
        case 'LOGIN_SUCCESS': {
            return action.payload;
        }
        default:
            return state;
    }
}