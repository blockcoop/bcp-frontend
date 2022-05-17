import coopService from "../services/coop.service";
import { TRANSACTION_SUBMITTED } from "../types";

export const createCoop = (address, name, symbol, votingPeriod, gracePeriod, quorum, supermajority, membershipFee) => (dispatch) => {
    return coopService.createCOOP(address, name, symbol, votingPeriod, gracePeriod, quorum, supermajority, membershipFee).then(
        (response) => {
            let data = {
                show: true,
                message: "Your BlockCOOP creation has been sent to Etherscan",
                address: response.status,
                code: response.code
            }
            dispatch({
                type: TRANSACTION_SUBMITTED,
                payload: data
            });
            return Promise.resolve(response.code);
        },
        (error) => {
            console.log(error);
            return Promise.reject();
        }
    );
}