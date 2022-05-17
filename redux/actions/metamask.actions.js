import metamaskService from "../services/metamask.service";
import { METAMASK_UPDATED } from "../types";

export const loadWallet = () => (dispatch) => {
    return metamaskService.getCurrentWalletConnect().then(
        (response) => {
            dispatch({
                type: METAMASK_UPDATED,
                payload: response
            });
            return Promise.resolve();
        },
        (error) => {
            console.log(error);
            return Promise.reject();
        }
    );
}

export const connectWallet = () => (dispatch) => {
    return metamaskService.connectWallet().then(
        (response) => {
            dispatch({
                type: METAMASK_UPDATED,
                payload: response
            });
            return Promise.resolve(response);
        },
        (error) => {
            console.log(error);
            return Promise.reject();
        }
    );
}

export const changeNetwork = () => (dispatch) => {
    return metamaskService.changeNetwork().then(
        (response) => {
            dispatch({
                type: METAMASK_UPDATED,
                payload: response
            });
            return Promise.resolve(response);
        },
        (error) => {
            console.log(error);
            return Promise.reject(false);
        }
    );
}