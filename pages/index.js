import Router from "next/router";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { createCoop } from "../redux/actions/coop.actions";
import { factoryContract } from "../redux/services/coop.service";
import { CHANGE_NETWORK_MODAL } from "../redux/types";

const CreateCoop = (props) => {

    const [name, setName] = useState("")
    const [symbol, setSymbol] = useState("")
    const [votingPeriod, setVotingPeriod] = useState(2)
    const [votingPeriodDuration, setVotingPeriodDuration] = useState(86400)
    const [gracePeriod, setGracePeriod] = useState(12)
    const [gracePeriodDuration, setGracePeriodDuration] = useState(3600)
    const [quorum, setQuorum] = useState(20)
    const [supermajority, setSupermajority] = useState(50)
    const [membershipFee, setMembershipFee] = useState(0)
    const [isCreating, setIsCreating] = useState(false)

    const [contractListner, setContractListner] = useState([])

    const handleCreateCoop = async () => {
        if(showNetworkModal()) {
            return;
        }

        if(name === '' || symbol === '' ) {
            toast.error("Please enter name and symbol for your BlockCOOP", {
                position: toast.POSITION.BOTTOM_CENTER
            })
            return;
        }

        setIsCreating(true)

        props.dispatch(
            createCoop(props.metamask.address, name, symbol, votingPeriod*votingPeriodDuration, quorum, supermajority, membershipFee)
        )
        .then((response) => {
            console.log(response)
            if(response !== 200) {
                setIsCreating(false);
            }
        })
        .catch(() => {
            setIsCreating(false);
        });
    }

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

    useEffect(() => {
        if(props.metamask.address !== "" && !contractListner.includes(props.metamask.address)) {
            contractListner.push(props.metamask.address)
            setContractListner(contractListner)
            factoryContract.events.CoopCreated({
                filter: {initiator: props.metamask.address}
            }, (error, data) => {
                if(error) {
                    toast.error("COOP creation failed.")
                } else {
                    toast.success("COOP created successfully.")
                    Router.push({
                        pathname: '/coop/'+data.returnValues.coopAddress,
                        query: { isNew: 1 }
                    })
                }
            });
        }
    }, [props.metamask.address])

    return (
        <Container className="main-content">
            <Form className="compact">
                <Row className="mb-3">
                    <Col sm="8">
                        <Form.Group controlId="name" className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col sm="4">
                        <Form.Group controlId="symbol" className="mb-3">
                            <Form.Label>Symbol</Form.Label>
                            <Form.Control type="text" placeholder="Enter Symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col sm="6">
                        <Form.Group controlId="voting-period">
                            <Form.Label>Voting Period</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Select value={votingPeriod} onChange={ (e) => setVotingPeriod(e.target.value) }>
                                    { Array.from(Array(31).keys()).slice(1).map(value => <option key={value} value={value}>{value}</option>) }
                                </Form.Select>
                                <Form.Select value={votingPeriodDuration} onChange={ (e) => setVotingPeriodDuration(e.target.value) }>
                                    <option value={3600}>Hours</option>
                                    <option value={86400}>Days</option>
                                </Form.Select>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col sm="6">
                        {/* <Form.Group controlId="grace-period">
                            <Form.Label>Grace Period</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Select value={gracePeriod} onChange={ (e) => setGracePeriod(e.target.value) }>
                                    { Array.from(Array(31).keys()).slice(1).map(value => <option key={value} value={value}>{value}</option>) }
                                </Form.Select>
                                <Form.Select value={gracePeriodDuration} onChange={ (e) => setGracePeriodDuration(e.target.value) }>
                                    <option value={3600}>Hours</option>
                                    <option value={86400}>Days</option>
                                </Form.Select>
                            </InputGroup>
                        </Form.Group> */}
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col sm="4">
                        <Form.Group controlId="quorum">
                            <Form.Label>Quorum</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Select value={quorum} onChange={ (e) => setQuorum(e.target.value) }>
                                    { Array.from(Array(11).keys()).slice(1).map(value => <option key={value} value={(value*10)}>{(value*10)}</option>) }
                                </Form.Select>
                                <InputGroup.Text>%</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col sm="4">
                        <Form.Group controlId="quorum">
                            <Form.Label>Supermajority</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Select value={supermajority} onChange={ (e) => setSupermajority(e.target.value) }>
                                    { Array.from(Array(11).keys()).slice(1).map(value => <option key={value} value={(value*10)}>{(value*10)}</option>) }
                                </Form.Select>
                                <InputGroup.Text>%</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col sm="4">
                        <Form.Group controlId="quorum">
                            <Form.Label>Membership Fee</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control type="number" step={0.1} min={0} placeholder="Fee" value={membershipFee} onChange={(e) => setMembershipFee(e.target.value)} />
                                <InputGroup.Text>ETH</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>
                <div className="text-center mt-5">
                    {
                        isCreating ? 
                        <Button size="lg" disabled>Creating a COOP {" "} &nbsp; <Spinner animation="border" size="sm" /></Button> : 
                        <Button size="lg" onClick={handleCreateCoop}>Create a COOP</Button>
                    }
                    
                </div>
            </Form>
        </Container>
    );
}

function mapStateToProps(state) {
    const { metamask } = state;
    return {
        metamask,
    }
}

export default connect(mapStateToProps)(CreateCoop);