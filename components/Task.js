import { useEffect, useState } from "react";
import { Badge, Button, ListGroup, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import coopService from "../redux/services/coop.service";
import Moment from "react-moment";
import moment from "moment";
import EtherscanAddressLink from "./EtherscanAddressLink";
import { participate } from "../redux/actions/coop.actions";

const Task = (props) => {

    const [task, setTask] = useState(null)
    const [participating, setParticipating] = useState(false)

    let currentTime = new Date().getTime() / 1000;

    useEffect(() => {
        coopService.getTask(props.coopAddress, props.taskId).then((taskDetails) => {
            setTask(taskDetails)
        })
    }, [props.coopAddress, props.taskId])

    const statuses = {
        0: 'Proposed',
        1: 'Voted',
        2: 'Cancelled',
        3: 'Started',
        4: 'Failed',
        5: 'Completed'
    }

    const handleParticipate = () => {
        setParticipating(true)
        props.dispatch(
            participate(props.metamask.address, props.coopAddress, props.taskId)
        )
        .then((response) => {
            console.log(response)
            if(response !== 200) {
                setParticipating(false);
            }
        })
        .catch(() => {
            setParticipating(false);
        });
    }

    return <ListGroup.Item className="p-4">
        {
            task ?
            <>
                <h5 className="fw-bold">
                    Task {props.taskId}
                    <Badge className="float-end">{statuses[task.taskStatus]}</Badge>
                </h5>
                <p>{task.details}</p>
                <ul className="list-inline">
                    <li className="list-inline-item me-4">
                        Creator: <b><EtherscanAddressLink address={task.creator} /></b>
                    </li>
                    <li className="list-inline-item me-4">
                        Voting Deadline: {" "}
                        <b><Moment unix format="DD/MM/YYYY hh:mm:ss">{task.votingDeadline}</Moment></b>
                    </li>
                    <li className="list-inline-item">
                        Task Deadline:  {" "}
                        <b><Moment unix format="DD/MM/YYYY hh:mm:ss">{task.taskDeadline}</Moment></b>
                    </li>
                </ul>
                <p className="fw-bold fs-6 mb-1">Participants: </p>
                {
                    task.participants.map((participant, i) => 
                    <span className="me-4" key={i} ><EtherscanAddressLink address={participant} /></span>)
                }
                <div className="actions mt-4">
                    <ul className="list-inline mb-0">
                    {
                        task.votingDeadline > currentTime &&
                        <li className="list-inline-item me-3">
                            <Button>Vote</Button>
                        </li>
                    }
                        <li className="list-inline-item">
                            {
                                participating ?
                                <Button disabled>Participating <Spinner animation="border" size="sm" /></Button> :
                                <Button onClick={handleParticipate}>Participate</Button>
                            }
                        </li>
                    </ul>
                </div>
            </> :
            <>
                Loading <Spinner animation="border" size="sm" />
            </>
        }
        
    </ListGroup.Item>
}

function mapStateToProps(state) {
    const { metamask } = state;
    return {
        metamask,
    }
}

export default connect(mapStateToProps)(Task);