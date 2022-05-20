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

export const joinCoop = (address, coopAddress) => (dispatch) => {
    return coopService.joinCoop(address, coopAddress).then(
        (response) => {
            let data = {
                show: true,
                message: "Your Join BlockCOOP request has been sent to Etherscan",
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

export const createTask = (address, coopAddress, details, votingDeadline, taskDeadline) => (dispatch) => {
    return coopService.createTask(address, coopAddress, details, votingDeadline, taskDeadline).then(
        (response) => {
            let data = {
                show: true,
                message: "Your Task creation request has been sent to Etherscan",
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

export const participate = (address, coopAddress, taskId) => (dispatch) => {
    return coopService.participate(address, coopAddress, taskId).then(
        (response) => {
            let data = {
                show: true,
                message: "Your participation request has been sent to Etherscan",
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