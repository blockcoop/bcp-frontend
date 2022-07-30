import { useEffect, useState } from "react";
import { Button, Form, Modal, Row, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { createGroup } from "../../redux/actions/groups.actions";
import groupsService, { groupsContract } from "../../redux/services/groups.service";
import { CHANGE_NETWORK_MODAL } from "../../redux/types";

const CreateGroup = (props) => {
    const [show, setShow] = useState(false)
    const [name, setName] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const [contractListner, setContractListner] = useState([])

    const handleCreateGroup = () => {
        if(showNetworkModal()) {
            return;
        }
        if(name === '') {
            toast.error("Enter Name", {
                position: toast.POSITION.BOTTOM_CENTER
            })
            return;
        }
        setIsCreating(true)
        props.dispatch(
            createGroup(props.metamask.address, props.coopAddress, name)
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
            groupsContract.events.GroupCreated({
                filter: {groupName: name}
            }, (error, data) => {
                if(error) {
                    toast.error("Problem with creating a group.")
                    setIsCreating(false);
                    setShow(false)
                } else {
                    toast.success("Group created successfully.")
                    props.loadGroups();
                    setIsCreating(false);
                    setShow(false)
                    setName("");
                }
            });
        }
    }, [props.metamask.address])

    return (<>
        <Button variant="primary" onClick={() => setShow(true)} className="float-end">
            Create Group
        </Button>
        <Modal
            show={show}
            onHide={() => setShow(false)}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Create Group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Group Name</Form.Label>
                        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Cancel
                </Button>
                {
                    isCreating ? 
                    <Button disabled>Creating Group <Spinner animation="border" size="sm" /></Button> :
                    <Button onClick={handleCreateGroup}>Create Group</Button>
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

export default connect(mapStateToProps)(CreateGroup);