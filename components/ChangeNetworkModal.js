import { FaExclamationTriangle } from 'react-icons/fa';
import { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { changeNetwork, connectWallet } from '../redux/actions/metamask.actions';
import { CHANGE_NETWORK_MODAL } from '../redux/types';

const ChangeNetworkModal = (props) => {
    const [pending, setPending] = useState(false);

    const handleNetworkChange = () => {
        setPending(true);
        props.dispatch(
            changeNetwork()
        )
        .then((response) => {
            setPending(false);
            if(response.chainId === '0x4') {
                toast.success("Network changed to Rinkeby.")
            } else {
                toast.error("User cancelled network change request.")
            }
            handleCloseModal();
        })
        .catch(() => {
            setPending(false);
            toast.error("Network not changed.")
            handleCloseModal();
        });
    }

    const handleConnect = () => {
        setPending(true);
        props.dispatch(
            connectWallet()
        )
        .then((response) => {
            setPending(false);
            if(response.address === '') {
                toast.success("Wallet connected.")
            } else {
                toast.error("Problem with connecting wallet.")
            }
            handleCloseModal();
        })
        .catch(() => {
            setPending(false);
            toast.error("Network not changed.")
            handleCloseModal();
        });
    } 

    const handleCloseModal = () => {
        props.dispatch({
            type: CHANGE_NETWORK_MODAL,
            payload: {showModal: false}
        });
    }

    return (
        <Modal
            show={props.wrongNetwork.showModal}
            onHide={handleCloseModal}
            backdrop="static"
            keyboard={false}
            centered
            id="change-network-modal"
        >
            <Modal.Body className="p-5 text-center">
                {/* <FontAwesomeIcon icon={faExclamationTriangle} style={{height: "35px"}} className="text-warning" /> */}
                <FaExclamationTriangle className="text-warning fs-1" />
                {
                    props.metamask.address === '' ?
                    <>
                        <h4 className="mb-4 mt-4">Your wallet is not Connected. Please connect wallet to do transaction.</h4>
                        {
                            pending ?
                            <Button disabled>Connecting <Spinner animation="border" size="sm" /></Button> :
                            <Button onClick={handleConnect}>Connect</Button>
                        }
                    </> :
                    <>
                        <h4 className="mb-4 mt-4">You are on wrong network. Please change network to Rinkeby to complete the transaction.</h4>
                        {
                            pending ?
                            <Button disabled>Changing Network <Spinner animation="border" size="sm" /></Button> :
                            <Button onClick={handleNetworkChange}>Change Network</Button>
                        }
                    </>
                }
                
                <Button variant="secondary" onClick={handleCloseModal}  style={{marginLeft: '15px'}}>Close</Button>
            </Modal.Body>
        </Modal>
    );
}

function mapStateToProps(state) {
    const { metamask } = state;
    const { wrongNetwork } = state.message
    return {
        metamask,
        wrongNetwork
    }
}

export default connect(mapStateToProps)(ChangeNetworkModal);