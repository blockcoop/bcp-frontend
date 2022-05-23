import { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { joinCoop } from "../redux/actions/coop.actions";
import coopService from "../redux/services/coop.service";

const JoinCoop = (props) => {
    const [joining, setJoining] = useState(false)
    const [contractListner, setContractListner] = useState([])

    const handleJoinCoop = () => {
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
                    props.loadCoopDetails();
                    setJoining(false);
                }
            });
        }
    }, [props.metamask.address])

    return <>
        {
            ! props.coop.members.includes(props.metamask.address) &&
            <div className="text-center">
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