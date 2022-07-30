import { useEffect, useState } from "react"
import { Button, Form, Modal, Spinner } from "react-bootstrap"
import { connect } from "react-redux"
import { toast } from "react-toastify"
import { assignModerator } from "../../redux/actions/groups.actions"
import { groupsContract } from "../../redux/services/groups.service"


const AssignModerator = (props) => {
    const [show, setShow] = useState(false)
    const [moderator, setModerator] = useState("")
    const [members, setMembers] = useState([])
    const [isAssigning, setIsAssigning] = useState(false)
    const [contractListner, setContractListner] = useState([])

    const handleAssignModerator = () => {
        if(showNetworkModal()) {
            return;
        }
        if(moderator === '') {
            toast.error("Select Moderator", {
                position: toast.POSITION.BOTTOM_CENTER
            })
            return;
        }
        setIsAssigning(true)
        props.dispatch(
            assignModerator(props.metamask.address, props.coopAddress, props.group.id, moderator)
        )
        .then((response) => {
            console.log(response)
            if(response !== 200) {
                setIsAssigning(false);
                setShow(false)
            }
        })
        .catch(() => {
            setIsAssigning(false);
            setShow(false)
        });
    } 

    useEffect(() => {
        let members = []
        props.group.members.forEach(member => {
            if(props.group.moderators.indexOf(member) === -1) {
                members.push(member)
            }
        });
        setMembers(members)
    }, [props.group])

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
            groupsContract.events.GroupModeratorAssigned({
                filter: {coopAddress: props.coopAddress, groupId: props.group.id}
            }, (error, data) => {
                if(error) {
                    toast.error("Problem with assigning a group moderator.")
                    setIsAssigning(false);
                    setShow(false)
                } else {
                    toast.success("Group moderator assigned successfully.")
                    props.loadGroups();
                    setIsAssigning(false);
                    setShow(false)
                    setName("");
                }
            });
        }
    }, [props.metamask.address])

    return (<>
        <Button variant="primary" size="sm" onClick={() => setShow(true)} className="float-end">
            Assign Moderator
        </Button>
        <Modal
            show={show}
            onHide={() => setShow(false)}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Assign Moderator</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Select Moderator</Form.Label>
                        <Form.Select onChange={(e) => setModerator(e.target.value)}>
                            <option value="">Select Moderator</option>
                            {
                                members.map(member => (
                                    <option key={member}>{member}</option>
                                ))
                            }
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Cancel
                </Button>
                {
                    isAssigning ? 
                    <Button disabled>Assigning Moderator <Spinner animation="border" size="sm" /></Button> :
                    <Button onClick={handleAssignModerator}>Assign Moderator</Button>
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

export default connect(mapStateToProps)(AssignModerator);