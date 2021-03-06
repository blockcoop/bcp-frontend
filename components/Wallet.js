import { FaExternalLinkAlt, FaExternalLinkSquareAlt, FaUnlink } from 'react-icons/fa'
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Badge, Button, Dropdown, DropdownButton, Nav, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { connect } from "react-redux";
import { connectWallet, loadWallet } from "../redux/actions/metamask.actions";
import metamaskService from '../redux/services/metamask.service';

const Wallet = (props) => {

    const [loading, setLoading] = useState(false);
    const [shortAddress, setShortAddress] = useState("");

    const handleConnect = async(e) => {
        e.preventDefault();
        setLoading(true);
        props.dispatch(
            connectWallet()
        )
        .then(() => {
            setLoading(false);
        })
        .catch(() => {
            setLoading(false);
        });
    }

    const loadCurrentWallet = useCallback( () => {
        setLoading(true);
        props.dispatch(
            loadWallet()
        )
        .then(() => {
            setLoading(false);
        })
        .catch(() => {
            setLoading(false);
        });
    }, []);

    const addWalletListener = useCallback( () => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                loadCurrentWallet();
            });
            window.ethereum.on("chainChanged", (chainId) => {
                loadCurrentWallet();
            });
        }
    }, [loadCurrentWallet]);

    useEffect( () => {
        if(props.metamask.address !== "") {
            setShortAddress(metamaskService.getShortAddress(props.metamask.address));
        }
    }, [props.metamask])

    useEffect( () => {
        addWalletListener();
        loadCurrentWallet();
    }, [addWalletListener, loadCurrentWallet])


    return (
        <>
        {
            props.metamask.address !== "" ? 
            <>
            {
                props.metamask.chainId === '0x4' ?
                <>
                    <DropdownButton id="dropdown-item-button" align="end"
                        title={"Connected: "+shortAddress}
                    >
                        <Dropdown.Item href={"https://rinkeby.etherscan.io/address/"+props.metamask.address} target="_blank" className="fw-bold">
                            {shortAddress} {" "} <small className="ms-2"><FaExternalLinkAlt /></small>
                        </Dropdown.Item>
                    </DropdownButton>
                </> :
                <>
                    <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip>Connect to Rinkeby Testnet</Tooltip>}
                    >
                        <span className="p-2 bg-danger rounded-pill text-light">
                            <FaUnlink /> { " " }
                            Wrong Network
                        </span>
                    </OverlayTrigger>
                </>
            }
            </> :
            <>
            {
                loading ?
                <Button disabled>Connecting Wallet <Spinner animation="border" size="sm" /></Button> :
                <Button onClick={handleConnect}>Connect Wallet</Button>
            }
            </>
        }
        </>
    )
}

function mapStateToProps(state) {
    const { metamask } = state;
    return {
        metamask,
    }
}

export default connect(mapStateToProps)(Wallet);