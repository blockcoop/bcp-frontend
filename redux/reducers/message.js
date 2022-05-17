import { CLOSE_TRANSACTION_MODAL, CHANGE_NETWORK_MODAL, TRANSACTION_SUBMITTED } from "../types";

const initialState = {
    transaction: {
        show: false,
        message: "",
        address: "",
        code: 0
    },
    wrongNetwork: {
        showModal: false
    }
}

const message = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case TRANSACTION_SUBMITTED:
            return {
                ...state,
                transaction: payload
            }
        case CLOSE_TRANSACTION_MODAL:
            return {
                ...state,
                transaction: {
                    show: false,
                    message: state.transaction.message,
                    address: state.transaction.address,
                    code: state.transaction.code
                }
            }
        case CHANGE_NETWORK_MODAL:
            return {
                ...state,
                wrongNetwork: payload
            }
        default:
            return state;
    }
}

export default message;