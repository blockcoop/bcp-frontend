import { useEffect, useState } from "react";
import { Button, OverlayTrigger, Popover, Spinner } from "react-bootstrap";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { participate, processTaskCompletion, processTaskVoting, taskCompletionVote, vote } from "../../redux/actions/tasks.actions";
import { taskContract } from "../../redux/services/tasks.service";
import { CHANGE_NETWORK_MODAL } from "../../redux/types";

const TaskActions = (props) => {
    const [voting, setVoting] = useState(false)
    const [participating, setParticipating] = useState(false)
    const [processVoting, setProcessVoting] = useState(false)
    const [taskCompletionVoting, setTaskCompletionVoting] = useState(false)
    const [processTask, setProcessTask] = useState(false)
    const [contractListner, setContractListner] = useState([])

    let currentTime = new Date().getTime() / 1000;

    const handleVote = (isYes) => {
        if(showNetworkModal()) {
            return;
        }
        setVoting(true)
        props.dispatch(
            vote(props.metamask.address, props.taskId, isYes)
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

    const handleParticipate = () => {
        if(showNetworkModal()) {
            return;
        }
        setParticipating(true)
        props.dispatch(
            participate(props.metamask.address, props.taskId)
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

    const handleProcessVoting = () => {
        if(showNetworkModal()) {
            return;
        }
        setProcessVoting(true)
        props.dispatch(
            processTaskVoting(props.metamask.address, props.taskId)
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

    const handleTaskCompletionVote = (isYes) => {
        if(showNetworkModal()) {
            return;
        }
        setTaskCompletionVoting(true)
        props.dispatch(
            taskCompletionVote(props.metamask.address, props.taskId, isYes)
        )
        .then((response) => {
            console.log(response)
            if(response !== 200) {
                setTaskCompletionVoting(false);
            }
        })
        .catch(() => {
            setTaskCompletionVoting(false);
        });
    }

    const handleProcessTask = (isCompleted) => {
        if(showNetworkModal()) {
            return;
        }
        setProcessTask(true)
        props.dispatch(
            processTaskCompletion(props.metamask.address, props.taskId)
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

    useEffect(() => {
        if(!contractListner.includes(props.metamask.address)) {
            contractListner.push(props.metamask.address)
            setContractListner(contractListner)

            taskContract.events.Voted({
                filter: {member: props.metamask.address, taskId: props.taskId}
            }, (error, data) => {
                if(error) {
                    toast.error("Problem with voting for a task.")
                    setVoting(false);
                } else {
                    toast.success("Voted for a task successfully.")
                    props.getTaskDetails();
                    setVoting(false);
                }
            });

            taskContract.events.Participated({
                filter: {participant: props.metamask.address, taskId: props.taskId}
            }, (error, data) => {
                if(error) {
                    toast.error("Problem with participating in a task.")
                    setParticipating(false);
                } else {
                    toast.success("Participated in a task successfully.")
                    props.getTaskDetails();
                    setParticipating(false);
                }
            });

            taskContract.events.TaskVoteProcessed({
                filter: {creator: props.metamask.address, taskId: props.taskId}
            }, (error, data) => {
                if(error) {
                    toast.error("Problem with process voting for a task.")
                    setProcessVoting(false);
                } else {
                    toast.success("Processed voting for a task successfully.")
                    props.getTaskDetails();
                    setProcessVoting(false);
                }
            });

            taskContract.events.VotedTaskCompletion({
                filter: {member: props.metamask.address, taskId: props.taskId}
            }, (error, data) => {
                if(error) {
                    toast.error("Problem with voting for a task completion.")
                    setTaskCompletionVoting(false);
                } else {
                    toast.success("Voted for a task completion successfully.")
                    props.getTaskDetails();
                    setTaskCompletionVoting(false);
                }
            });

            taskContract.events.TaskCompletionProcessed({
                filter: {member: props.metamask.address, taskId: props.taskId}
            }, (error, data) => {
                if(error) {
                    toast.error("Problem with processing a task completion.")
                    setTaskCompletionVoting(false);
                } else {
                    toast.success("Processed a task completion successfully.")
                    props.getTaskDetails();
                    setTaskCompletionVoting(false);
                }
            });
        }
    },[props.metamask.address])

    const voteComponent = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Vote for the Task</Popover.Header>
            <Popover.Body className="text-center">
                <FaThumbsUp className="text-success fs-4" title="Vote Yes" style={{cursor: 'pointer'}} onClick={() => handleVote(true)} /> {" "} &nbsp;&nbsp;
                <FaThumbsDown className="text-danger fs-4" title="Vote No" style={{cursor: 'pointer'}} onClick={() => handleVote(false)} />
            </Popover.Body>
        </Popover>
    )

    const taskCompletionVoteComponent = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Vote for the Task Completion</Popover.Header>
            <Popover.Body className="text-center">
                <FaThumbsUp className="text-success fs-4" title="Vote Yes" style={{cursor: 'pointer'}} onClick={() => handleTaskCompletionVote(true)} /> {" "} &nbsp;&nbsp;
                <FaThumbsDown className="text-danger fs-4" title="Vote No" style={{cursor: 'pointer'}} onClick={() => handleTaskCompletionVote(false)} />
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

    return (
        <ul className="list-inline mb-0">
        {
            props.groupId == props.task.groupId &&
            <>
            {
                props.task.votingDeadline > currentTime &&
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
                (! props.task.participants.includes(props.metamask.address) && props.task.votingDeadline > currentTime) &&
                <li className="list-inline-item mt-3">
                    {
                        participating ?
                        <Button disabled>Participating <Spinner animation="border" size="sm" /></Button> :
                        <Button onClick={handleParticipate}>Participate</Button>
                    }
                </li>
            }
            {
                (props.task.votingDeadline > currentTime && props.taskStatus == '5' ) &&
                <li className="list-inline-item me-3 mt-3">
                    {
                        taskCompletionVoting ?
                        <Button disabled>Task Completion Voting <Spinner animation="border" size="sm" /></Button> :
                        <OverlayTrigger trigger="click" placement="top" overlay={taskCompletionVoteComponent}>
                            <Button>Task Completion Vote</Button>
                        </OverlayTrigger>
                    }
                    
                </li>
            }
            </>
        }
        {
            props.task.creator === props.metamask.address &&
            <>
            {
                (props.task.votingDeadline < currentTime && props.task.taskStatus === "1") &&
                <li className="list-inline-item mt-3">
                    {
                        processVoting ?
                        <Button disabled>Processing Voting <Spinner animation="border" size="sm" /></Button> :
                        <Button onClick={handleProcessVoting}>Process Voting</Button>
                    }
                    
                </li>
            }
            {
                ((props.task.taskDeadline + 604800) < currentTime && props.task.taskStatus === "5") &&
                <li className="list-inline-item mt-3">
                    {
                        processTask ?
                        <Button disabled>Processing Task Completion <Spinner animation="border" size="sm" /></Button> :
                        <Button onClick={handleProcessTask}>Process Task Completion</Button>
                    }
                    
                </li>
            }
            </>
        }
        </ul>
    )
}

function mapStateToProps(state) {
    const { metamask } = state;
    return {
        metamask,
    }
}

export default connect(mapStateToProps)(TaskActions);