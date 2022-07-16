import { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { joinGroup } from "../../redux/actions/coop.actions";
import coopService from "../../redux/services/coop.service";
import { CHANGE_NETWORK_MODAL } from "../../redux/types";

const JoinGroup = (props) => {
    const [joining, setJoining] = useState(false)
    const [contractListner, setContractListner] = useState([])

    const handleJoinGroup = () => {
        if(showNetworkModal()) {
            return;
        }
        setJoining(true);
        props.dispatch(
            joinGroup(props.metamask.address, props.coopAddress, props.groupId, props.coopMembershipFee)
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
        if(!contractListner.includes(props.metamask.address) && props.coopAddress) {
            contractListner.push(props.metamask.address)
            setContractListner(contractListner)
            const coopContract = coopService.getCoopContract(props.coopAddress)
            coopContract.events.CoopJoined({
                filter: {member: props.metamask.address, groupId: props.groupId}
            }, (error, data) => {
                if(error) {
                    toast.error("Problem with joining the COOP.")
                    setJoining(false);
                } else {
                    toast.success("COOP joined successfully.")
                    props.loadGroups();
                    setJoining(false);
                }
            });
        }
    }, [props.metamask.address])

    return <>
        {
            joining ?
            <Button size="sm" disabled>Joining Group <Spinner animation="border" size="sm" /></Button> :
            <Button size="sm" onClick={handleJoinGroup}>Join Group</Button>
        }
    </>
}

function mapStateToProps(state) {
    const { metamask } = state;
    return {
        metamask,
    }
}

export default connect(mapStateToProps)(JoinGroup);