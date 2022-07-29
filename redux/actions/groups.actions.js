import groupsService from "../services/groups.service";
import { TRANSACTION_SUBMITTED } from "../types";

export const createGroup = (address, coopAddress, name) => (dispatch) => {
    return groupsService.createGroup(address, coopAddress, name).then(
        (response) => {
            let data = {
                show: true,
                message: "Your Group creation request has been sent to Etherscan",
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

export const joinGroup = (address, coopAddress, groupId) => (dispatch) => {
    return groupsService.joinGroup(address, coopAddress, groupId).then(
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

export const assignModerator = (address, coopAddress, groupId, moderator) => (dispatch) => {
    return groupsService.assignModerator(address, coopAddress, groupId, moderator).then(
        (response) => {
            let data = {
                show: true,
                message: "Your group moderator assigned request has been sent to Etherscan",
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