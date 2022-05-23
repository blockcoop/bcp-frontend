import { useEffect, useState } from "react";
import { Badge, Button, ListGroup, OverlayTrigger, Popover, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import coopService from "../redux/services/coop.service";
import Moment from "react-moment";
import moment from "moment";
import EtherscanAddressLink from "./EtherscanAddressLink";
import { participate, vote } from "../redux/actions/coop.actions";
import { toast } from "react-toastify";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";

const Task = (props) => {

    const [task, setTask] = useState(null)
    const [participating, setParticipating] = useState(false)
    const [voting, setVoting] = useState(false)
    const [contractListner, setContractListner] = useState([])

    let currentTime = new Date().getTime() / 1000;

    const getTaskDetails = async () => {
        coopService.getTask(props.coopAddress, props.taskId).then((taskDetails) => {
            setTask(taskDetails)
        })
    }

    useEffect(() => {
        getTaskDetails()
        if(!contractListner.includes(props.metamask.address) && props.coopAddress !== '') {
            contractListner.push(props.metamask.address)
            setContractListner(contractListner)
            const coopContract = coopService.getCoopContract(props.coopAddress)
            
            coopContract.events.Participated({
                filter: {participant: props.metamask.address, taskId: props.taskId}
            }, (error, data) => {
                if(error) {
                    toast.error("Problem with participating in a task.")
                    setParticipating(false);
                } else {
                    toast.success("Participated in a task successfully.")
                    getTaskDetails();
                    setParticipating(false);
                }
            });

            coopContract.events.Voted({
                filter: {member: props.metamask.address, taskId: props.taskId}
            }, (error, data) => {
                if(error) {
                    toast.error("Problem with voting for a task.")
                    setVoting(false);
                } else {
                    toast.success("Voted for a task successfully.")
                    getTaskDetails();
                    setVoting(false);
                }
            });
        }
    }, [props.metamask.address])

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

    const handleVote = (isYes) => {
        setVoting(true)
        props.dispatch(
            vote(props.metamask.address, props.coopAddress, props.taskId, isYes)
        )
        .then((response) => {
            console.log(response)
            if(response !== 200) {
                setVoting(false);
            }
        })
        .catch(() => {
            setVoting(false);
        });
    }

    const voteComponent = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Vote for the Task</Popover.Header>
            <Popover.Body className="text-center">
                <FaThumbsUp className="text-success fs-4" title="Vote Yes" style={{cursor: 'pointer'}} onClick={() => handleVote(true)} /> {" "} &nbsp;&nbsp;
                <FaThumbsDown className="text-danger fs-4" title="Vote No" style={{cursor: 'pointer'}} onClick={() => handleVote(false)} />
            </Popover.Body>
        </Popover>
    )

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
                        <b><Moment unix format="DD/MM/YYYY hh:mm:ss a">{task.votingDeadline}</Moment></b>
                    </li>
                    <li className="list-inline-item">
                        Task Deadline:  {" "}
                        <b><Moment unix format="DD/MM/YYYY hh:mm:ss a">{task.taskDeadline}</Moment></b>
                    </li>
                </ul>
                <p className="fw-bold fs-6 mb-1">Participants: </p>
                {
                    task.participants.map((participant, i) => 
                    <span className="me-4" key={i} >
                        {
                            participant === props.metamask.address ?
                            <a href={"https://ropsten.etherscan.io/address/"+participant} target="_blank" rel="noreferrer">
                                You
                            </a> :
                            <EtherscanAddressLink address={participant} />
                        }
                    </span>)
                }
                <div className="actions mt-4">
                    <ul className="list-inline mb-0">
                    {
                        task.votingDeadline > currentTime &&
                        <li className="list-inline-item me-3">
                            {
                                voting ?
                                <Button disabled>Voting <Spinner animation="border" size="sm" /></Button> :
                                <OverlayTrigger trigger="click" placement="top" overlay={voteComponent}>
                                    <Button>Vote</Button>
                                </OverlayTrigger>
                            }
                            
                        </li>
                    }
                    {
                        ! task.participants.includes(props.metamask.address) &&
                        <li className="list-inline-item">
                            {
                                participating ?
                                <Button disabled>Participating <Spinner animation="border" size="sm" /></Button> :
                                <Button onClick={handleParticipate}>Participate</Button>
                            }
                        </li>
                    }

                        
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