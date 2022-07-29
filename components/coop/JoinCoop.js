import { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { joinCoop } from "../../redux/actions/coop.actions";
import coopService from "../../redux/services/coop.service";
import { CHANGE_NETWORK_MODAL } from "../../redux/types";

const JoinCoop = (props) => {
    const [joining, setJoining] = useState(false)
    const [contractListner, setContractListner] = useState([])

    const handleJoinCoop = () => {
        if(showNetworkModal()) {
            return;
        }
        setJoining(true);
        props.dispatch(
            joinCoop(props.metamask.address, props.coop.address, props.coop.membershipFee)
        )
        .then((response) => {
            if(response !== 200) {
                setJoining(false);
            }
        })
        .catch(() => {
            setJoining(false);
        });
    }

    const showNetworkModal = () => {
        if(props.metamask.address === "" || props.metamask.chainId !== '0x3') {
            props.dispatch({
                type: CHANGE_NETWORK_MODAL,
                payload: {showModal: true}
            });
            return true;
        } else {
            return false
        }
    }

    useEffect(() => {
        if(!contractListner.includes(props.metamask.address) && props.coop.address) {
            contractListner.push(props.metamask.address)
            setContractListner(contractListner)
            const coopContract = coopService.getCoopContract(props.coop.address)
            coopContract.events.CoopJoined({
                filter: {member: props.metamask.address}
            }, (error, data) => {
                if(error) {
                    toast.error("Problem with joining the COOP.")
                    setJoining(false);
                } else {
                    toast.success("COOP joined successfully.")
                    props.loadCoopMembership();
                    setJoining(false);
                }
            });
        }
    }, [props.metamask.address])

    return <>
        {
            ! props.coop.members.includes(props.metamask.address) &&
            <div className="mt-5">
                {
                    joining ?
                    <Button disabled>Joining COOP <Spinner animation="border" size="sm" /></Button> :
                    <Button onClick={handleJoinCoop}>Join COOP</Button>
                }
                
            </div>
        }
    </>
}

function mapStateToProps(state) {
    const { metamask } = state;
    return {
        metamask,
    }
}

export default connect(mapStateToProps)(JoinCoop);