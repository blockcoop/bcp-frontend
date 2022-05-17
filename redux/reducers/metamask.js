import { METAMASK_UPDATED } from "../types";

const initialState = {
    address: "",
    chainId: "",
    status: "NOT_LOADED"
}

const metamask = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case METAMASK_UPDATED:
            return {
                ...state,
                address: payload.address,
                chainId: payload.chainId,
                status: payload.status
            }
        default:
            return state;
    }
}

export default metamask;