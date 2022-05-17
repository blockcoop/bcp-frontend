import { FaExternalLinkAlt, FaExternalLinkSquareAlt, FaUnlink } from 'react-icons/fa'
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Badge, Button, Dropdown, DropdownButton, Nav, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { connect } from "react-redux";
import { connectWallet, loadWallet } from "../redux/actions/metamask.actions";

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
            setShortAddress(String(props.metamask.address).substring(0, 6) + "..." + String(props.metamask.address).substring(38));
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
                props.metamask.chainId === '0x3' ?
                <>
                    <DropdownButton variant="color" id="dropdown-item-button" align="end"
                        title={"Connected: "+shortAddress}
                    >
                        <Dropdown.Item href={"https://ropsten.etherscan.io/address/"+props.metamask.address} target="_blank" className="fw-bold">
                            {shortAddress} {" "} <FaExternalLinkAlt />
                        </Dropdown.Item>
                    </DropdownButton>
                </> :
                <>
                    <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip>Connect to Ropsten Testnet</Tooltip>}
                    >
                        <Badge pill bg="danger" text="light">
                            <FaUnlink /> { " " }
                            Wrong Network
                        </Badge>
                    </OverlayTrigger>
                </>
            }
            </> :
            <>
            {
                loading ?
                <Button variant="color" disabled>Connecting Wallet <Spinner animation="border" size="sm" /></Button> :
                <Button variant="color" onClick={handleConnect}>Connect Wallet</Button>
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