import { useCallback, useEffect, useState } from "react";
import { Badge, ListGroup, Spinner } from "react-bootstrap";
import Moment from "react-moment";
import { connect } from "react-redux";
import tasksService from "../../redux/services/tasks.service";
import EtherscanAddressLink from "../EtherscanAddressLink";
import TaskActions from "./TaskActions";

const Task = (props) => {
    const [task, setTask] = useState(null)
    const [taskGroup, setGroup] = useState(null)

    const getTaskDetails = useCallback( async () => {
        tasksService.getTask(props.taskId).then((taskDetails) => {
            setTask(taskDetails)

        })
    }, [props.taskId])

    useEffect(() => {
        if(props.groups !== null && task !== null) {
            props.groups.forEach(group => {
                if(group.id == task.groupId) {
                    setGroup(group);
                }
            });
        }
    }, [props.groups, task])

    useEffect(() => {
        getTaskDetails();
    }, [getTaskDetails])

    const statuses = {
        0: 'Invalid',
        1: 'Proposed',
        2: 'Voted',
        3: 'NotAccepted',
        4: 'Cancelled',
        5: 'Started',
        6: 'Failed',
        7: 'Completed'
    }

    const statusColor = {
        0: 'dark',
        1: 'warning',
        2: 'primary',
        3: 'secondary',
        4: 'secondary',
        5: 'info',
        6: 'danger',
        7: 'success'
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
                        <Badge>{taskGroup ? taskGroup.name : ''}</Badge>
                    </li>
                    <li className="list-inline-item me-4">
                        Creator: <b><EtherscanAddressLink address={task.creator} /></b>
                    </li>
                    <li className="list-inline-item me-4">
                        Voting Deadline: {" "}
                        <b><Moment unix format="DD/MM/YYYY hh:mm a">{task.votingDeadline}</Moment></b>
                    </li>
                    <li className="list-inline-item">
                        Task Deadline:  {" "}
                        <b><Moment unix format="DD/MM/YYYY hh:mm a">{task.taskDeadline}</Moment></b>
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
                {
                    (taskGroup && taskGroup.members.indexOf(props.metamask.address) !== -1 || task.creator == props.metamask.address) &&
                    <TaskActions taskId={props.taskId} group={taskGroup} task={task} getTaskDetails={getTaskDetails}/>
                }
            </>:
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