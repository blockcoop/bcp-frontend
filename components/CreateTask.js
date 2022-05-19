import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { connect } from "react-redux";

const CreateTask = (props) => {
    const [show, setShow] = useState(false)
    const [description, setDescription] = useState("")
    const [taskDeadline, setTaskDeadline] = useState("")
    const [votingDeadline, setVotingDeadline] = useState("")

    const handleCreateTask = () => {

    }

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
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Task Description</Form.Label>
                        <Form.Control as="textarea" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </Form.Group>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="task-deadline">
                            <Form.Label>Task Deadline</Form.Label>
                            <Form.Control type="datetime-local"  value={taskDeadline} onChange={(e) => setTaskDeadline(e.target.value)} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="voting-deadline">
                            <Form.Label>Voting Deadline</Form.Label>
                            <Form.Control type="datetime-local" value={votingDeadline} onChange={(e) => setVotingDeadline(e.target.value)} />
                        </Form.Group>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Cancel
                </Button>
                <Button onClick={handleCreateTask}>Create Task</Button>
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