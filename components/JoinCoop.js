import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { joinCoop } from "../redux/actions/coop.actions";

const JoinCoop = (props) => {
    const [joining, setJoining] = useState(false)

    const handleJoinCoop = () => {
        setJoining(true);
        props.dispatch(
            joinCoop(props.metamask.address, props.coop.address)
        )
        .then((response) => {
            console.log(response)
            if(response !== 200) {
                setJoining(false);
            }
        })
        .catch(() => {
            setJoining(false);
        });
    }

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