import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa'
import Link from "next/link";
import { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { CLOSE_TRANSACTION_MODAL } from '../redux/types';

class TransactionModal extends Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(e) {
        e.preventDefault();
        this.props.dispatch({
            type: CLOSE_TRANSACTION_MODAL,
            payload: {
                show: false,
                message: this.props.message.transaction.message,
                code: this.props.message.transaction.code
            },
        });
    }

    render() {
        const { transaction } = this.props.message;
        return (
            <Modal
                show={transaction.show}
                onHide={this.handleClose}
                backdrop="static"
                keyboard={false}
                centered
                id="transaction-modal"
            >
                
                <Modal.Body className="p-5 text-center">
                    {
                        transaction.code === 200 ? 
                        <div className="mb-4">
                            <FaCheckCircle  className="text-success fs-1" />
                            <h4 className="mt-3 fw-bold">{transaction.message}</h4>
                        </div> :
                        <>
                        {
                            transaction.code === 1000 ?
                            <div>
                                <FaExclamationCircle  className="text-warning fs-1" />
                                <h4 className="mt-3 mb-3 fw-bold">{transaction.message}</h4>
                            </div> :
                            <div>
                                <FaTimesCircle className="text-danger fs-1" />
                                <h3 className="mt-3 fw-bold">Your transaction has been cancelled</h3>
                                <p>{transaction.address}</p>
                            </div>
                        }
                        
                        </>
                    }
                    {
                        transaction.code === 200 &&
                        <Link href={`https://ropsten.etherscan.io/tx/${transaction.address}`}>
                            <a className="btn btn-primary active" target="_blank" style={{marginRight: "15px"}}>View TXN</a>
                        </Link>
                        
                    } {" "}
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                </Modal.Body>
            </Modal>
        );
    }
}

function mapStateToProps(state) {
    const { message } = state;
    return {
        message
    }
}

export default connect(mapStateToProps)(TransactionModal);