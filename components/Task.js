import { useEffect, useState } from "react";
import { Badge, Button, ListGroup, OverlayTrigger, Popover, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import coopService from "../redux/services/coop.service";
import Moment from "react-moment";
import moment from "moment";
import EtherscanAddressLink from "./EtherscanAddressLink";
import { participate, processTaskCompletion, processTaskVoting, vote } from "../redux/actions/coop.actions";
import { toast } from "react-toastify";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { CHANGE_NETWORK_MODAL } from "../redux/types";

const Task = (props) => {

    const [task, setTask] = useState(null)
    const [participating, setParticipating] = useState(false)
    const [voting, setVoting] = useState(false)
    const [processVoting, setProcessVoting] = useState(false)
    const [processTask, setProcessTask] = useState(false)
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

            coopContract.events.TaskVoteProcessed({
                filter: {creator: props.metamask.address, taskId: props.taskId}
            }, (error, data) => {
                if(error) {
                    toast.error("Problem with process voting for a task.")
                    setProcessVoting(false);
                } else {
                    toast.success("Processed voting for a task successfully.")
                    getTaskDetails();
                    setProcessVoting(false);
                }
            });

            coopContract.events.TaskCompletionProcessed({
                filter: {creator: props.metamask.address, taskId: props.taskId}
            }, (error, data) => {
                if(error) {
                    toast.error("Problem with processing task completion.")
                    setProcessTask(false);
                } else {
                    toast.success("Processed task completion successfully.")
                    getTaskDetails();
                    setProcessTask(false);
                }
            });
        }
    }, [props.metamask.address])

    const statuses = {
        0: 'Proposed',
        1: 'Voted',
        2: 'NotAccepted',
        3: 'Cancelled',
        4: 'Started',
        5: 'Failed',
        6: 'Completed'
    }

    const statusColor = {
        0: 'warning',
        1: 'primary',
        2: 'secondary',
        3: 'secondary',
        4: 'info',
        5: 'danger',
        6: 'success'
    }

    const handleParticipate = () => {
        if(showNetworkModal()) {
            return;
        }
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
        if(showNetworkModal()) {
            return;
        }
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

    const handleProcessVoting = () => {
        if(showNetworkModal()) {
            return;
        }
        setProcessVoting(true)
        props.dispatch(
            processTaskVoting(props.metamask.address, props.coopAddress, props.taskId)
        )
        .then((response) => {
            console.log(response)
            if(response !== 200) {
                setProcessVoting(false);
            }
        })
        .catch(() => {
            setProcessVoting(false);
        });
    }

    const handleProcessTask = (isCompleted) => {
        if(showNetworkModal()) {
            return;
        }
        setProcessTask(true)
        props.dispatch(
            processTaskCompletion(props.metamask.address, props.coopAddress, props.taskId, isCompleted)
        )
        .then((response) => {
            console.log(response)
            if(response !== 200) {
                setProcessTask(false);
            }
        })
        .catch(() => {
            setProcessTask(false);
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

    const taskCompletionComponent = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Is this task complete?</Popover.Header>
            <Popover.Body className="text-center">
                <Button className="mb-3" onClick={()=>handleProcessTask(true)}>Task is complete</Button>
                <Button variant="secondary" onClick={()=>handleProcessTask(false)}>Task is not Complete</Button>
            </Popover.Body>
        </Popover>
    )

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

    return <ListGroup.Item className="p-4">
        {
            task ?
            <>
                <h5 className="fw-bold">
                    Task {props.taskId}
                    <Badge bg={statusColor[task.taskStatus]} className="float-end">{statuses[task.taskStatus]}</Badge>
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
                <div className="actions">
                    <ul className="list-inline mb-0">
                    {
                        task.votingDeadline > currentTime &&
                        <li className="list-inline-item me-3 mt-3">
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
                        (! task.participants.includes(props.metamask.address) && task.votingDeadline > currentTime) &&
                        <li className="list-inline-item mt-3">
                            {
                                participating ?
                                <Button disabled>Participating <Spinner animation="border" size="sm" /></Button> :
                                <Button onClick={handleParticipate}>Participate</Button>
                            }
                        </li>
                    }
                    {
                        (task.creator === props.metamask.address && task.votingDeadline < currentTime && task.taskStatus === "0") &&
                        <li className="list-inline-item mt-3">
                            {
                                processVoting ?
                                <Button disabled>Processing Voting <Spinner animation="border" size="sm" /></Button> :
                                <Button onClick={handleProcessVoting}>Process Voting</Button>
                            }
                            
                        </li>
                    }
                    {
                        (task.creator === props.metamask.address && task.taskDeadline < currentTime && task.taskStatus === "4") &&
                        <li className="list-inline-item mt-3">
                            {
                                processTask ?
                                <Button disabled>Processing Task Completion <Spinner animation="border" size="sm" /></Button> :
                                <OverlayTrigger trigger="click" placement="right" overlay={taskCompletionComponent}>
                                    <Button>Process Task Completion</Button>
                                </OverlayTrigger>
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