import tasksService from "../services/tasks.service";
import { TRANSACTION_SUBMITTED } from "../types";

export const createTask = (address, coopAddress, groupId, details, votingDeadline, taskDeadline) => (dispatch) => {
    return tasksService.createTask(address, coopAddress, groupId, details, votingDeadline, taskDeadline).then(
        (response) => {
            let data = {
                show: true,
                message: "Your Task creation has been sent to Etherscan",
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

export const vote = (address, taskId, isYes) => (dispatch) => {
    return tasksService.vote(address, taskId, isYes).then(
        (response) => {
            let data = {
                show: true,
                message: "Your vote has been sent to Etherscan",
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

export const participate = (address, taskId) => (dispatch) => {
    return tasksService.participate(address, taskId).then(
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

export const processTaskVoting = (address, taskId) => (dispatch) => {
    return tasksService.processTaskVoting(address, taskId).then(
        (response) => {
            let data = {
                show: true,
                message: "Your process voting request has been sent to Etherscan",
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

export const taskCompletionVote = (address, taskId, isYes) => (dispatch) => {
    return tasksService.voteTaskCompletion(address, taskId, isYes).then(
        (response) => {
            let data = {
                show: true,
                message: "Your vote for task completion has been sent to Etherscan",
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

export const processTaskCompletion = (address, taskId) => (dispatch) => {
    return tasksService.processTaskCompletion(address, taskId).then(
        (response) => {
            let data = {
                show: true,
                message: "Your process task completion request has been sent to Etherscan",
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