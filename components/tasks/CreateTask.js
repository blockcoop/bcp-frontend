import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { createTask } from "../../redux/actions/tasks.actions";
import { taskContract } from "../../redux/services/tasks.service";
import { CHANGE_NETWORK_MODAL } from "../../redux/types";

const CreateTask = (props) => {
    const [show, setShow] = useState(false)
    const [details, setDetails] = useState("")
    const [groupId, setGroupId] = useState("")
    const [taskDeadline, setTaskDeadline] = useState("")
    const [votingDeadline, setVotingDeadline] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const [contractListner, setContractListner] = useState([])

    const handleCreateTask = () => {
        if(showNetworkModal()) {
            return;
        }
        if(details === '' || taskDeadline === '' || votingDeadline === '' || groupId === "") {
            toast.error("All fields compulsory", {
                position: toast.POSITION.BOTTOM_CENTER
            })
            return;
        }
        let currentTime = new Date().getTime() / 1000;
        let taskDeadlineTime = new Date(taskDeadline).getTime() / 1000;
        let votingDeadlineTime = new Date(votingDeadline).getTime() / 1000;
        if(votingDeadlineTime < currentTime) {
            toast.error("Invalid voting deadline", {
                position: toast.POSITION.BOTTOM_CENTER
            })
            return;
        }
        if(taskDeadlineTime < votingDeadlineTime) {
            toast.error("Voting deadline should be less than Task deadline", {
                position: toast.POSITION.BOTTOM_CENTER
            })
            return;
        }
        setIsCreating(true)
        props.dispatch(
            createTask(props.metamask.address, props.coopAddress, groupId, details, votingDeadlineTime, taskDeadlineTime)
        )
        .then((response) => {
            console.log(response)
            if(response !== 200) {
                setIsCreating(false);
                setShow(false)
            }
        })
        .catch(() => {
            setIsCreating(false);
            setShow(false)
        });
    }

    const showNetworkModal = () => {
        if(props.metamask.address === "" || props.metamask.chainId !== '0x4') {
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
        if(!contractListner.includes(props.metamask.address) && props.coopAddress !== '') {
            contractListner.push(props.metamask.address)
            setContractListner(contractListner)
            taskContract.events.TaskCreated({
                filter: {creator: props.metamask.address}
            }, (error, data) => {
                if(error) {
                    toast.error("Problem with creating a task.")
                    setIsCreating(false);
                    setShow(false)
                } else {
                    toast.success("Task created successfully.")
                    props.loadTasks();
                    setIsCreating(false);
                    setShow(false)
                    setDetails("");
                    setGroupId("");
                    setVotingDeadline("");
                    setTaskDeadline("");
                }
            });
        }
    }, [props.metamask.address])

    return (<>
        <Button variant="primary" onClick={() => setShow(true)}>
            Create Task
        </Button>
        <Modal
            show={show}
            onHide={() => setShow(false)}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Create Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="groupId">
                        <Form.Label>Group</Form.Label>
                        <Form.Select onChange={(e) => setGroupId(e.target.value)}>
                            <option value="">Select Group</option>
                            {
                                props.groups.map(group => (
                                    <option key={group.id} value={group.id}>{group.name}</option>
                                ))
                            }
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="details">
                        <Form.Label>Task Details</Form.Label>
                        <Form.Control as="textarea" rows="3" value={details} onChange={(e) => setDetails(e.target.value)} />
                    </Form.Group>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="voting-deadline">
                            <Form.Label>Voting Deadline</Form.Label>
                            <Form.Control type="datetime-local" min={new Date()} value={votingDeadline} onChange={(e) => setVotingDeadline(e.target.value)} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="task-deadline">
                            <Form.Label>Task Deadline</Form.Label>
                            <Form.Control type="datetime-local" min={new Date()}  value={taskDeadline} onChange={(e) => setTaskDeadline(e.target.value)} />
                        </Form.Group>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Cancel
                </Button>
                {
                    isCreating ? 
                    <Button disabled>Creating Task <Spinner animation="border" size="sm" /></Button> :
                    <Button onClick={handleCreateTask}>Create Task</Button>
                }
            </Modal.Footer>
        </Modal>
    </>)
}

function mapStateToProps(state) {
    const { metamask } = state;
    return {
        metamask,
    }
}

export default connect(mapStateToProps)(CreateTask);