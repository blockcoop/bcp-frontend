import axios from "axios";
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
    const [countries, setCountries] = useState([])
    const [country, setCountry] = useState("")
    const [register, setRegister] = useState(null)
    const [tnc, setTnc] = useState(false)
    const [disclaimer, setDisclaimer] = useState(false)

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

        if(register == null) {
            toast.error("Please choose whether you want to register your BlockCOOP", {
                position: toast.POSITION.BOTTOM_CENTER
            })
            return;
        }

        if(register == true && country == '') {
            toast.error("Please choose country where you want to register your BlockCOOP", {
                position: toast.POSITION.BOTTOM_CENTER
            })
            return;
        }

        if(!tnc) {
            toast.error("You need to accept TnC", {
                position: toast.POSITION.BOTTOM_CENTER
            })
            return;
        }

        if(!disclaimer) {
            toast.error("You need to accept disclaimer", {
                position: toast.POSITION.BOTTOM_CENTER
            })
            return;
        }

        setIsCreating(true)

        props.dispatch(
            createCoop(props.metamask.address, name, symbol, votingPeriod*votingPeriodDuration, quorum, supermajority, membershipFee, country)
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

    const loadCountries = () => {
        axios.get('https://restcountries.com/v3.1/all?fields=name')
        .then(function (response) {
            if(response.status == 200) {
                var result = response.data.map(country => country.name.common);
            }
            setCountries(result.sort());
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    const handleRegisterChange = (event) => {
        if(event.target.value == "register") {
            setRegister(true);
        } else {
            setRegister(false);
        }
    }

    useEffect(() => {
        if(register) {
            if(countries.length == 0) {
                loadCountries();
            }
        }
    }, [register, countries.length])

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
                    <Col sm="5">
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
                    <Col sm="7">
                        <Row>
                            <Col sm="6">
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
                            <Col sm="6">
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
                        </Row>
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
                            <Form.Label>Membership Fee</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control type="number" step={0.1} min={0} placeholder="Fee" value={membershipFee} onChange={(e) => setMembershipFee(e.target.value)} />
                                <InputGroup.Text>ETH</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3" onChange={handleRegisterChange}>
                    <Col sm="6">
                        <Form.Check 
                            type="radio"
                            id="radio-register"
                            label="I would like to register"
                            name="register-radio"
                            value="register"
                        />
                    </Col>
                    <Col sm="6">
                        <Form.Check 
                            type="radio"
                            id="radio-register-later"
                            label="I'll do it later"
                            name="register-radio"
                            value="later"
                        />
                    </Col>
                </Row>
                {
                    register &&
                    <Row className="mb-3">
                        <Col sm="6">
                            <Form.Select value={country} onChange={ (e) => setCountry(e.target.value) }>
                                <option value="">Select Country</option>
                                {countries.map(country => <option key={country} value={country}>{country}</option>)}
                            </Form.Select>
                        </Col>
                    </Row>
                }
                <Form.Group className="mb-3" controlId="tnc">
                    <Form.Check type="checkbox" label="I understand that I need to comply with the legal regulations in my jurisdiction of operations" onChange={ (e) => setTnc(!tnc) } />
                </Form.Group>
                <Form.Group className="mb-3" controlId="disclaimer">
                    <Form.Check type="checkbox" label="I understand that this is an alpha version and there is risk involved." onChange={ (e) => setDisclaimer(!disclaimer) } />
                </Form.Group>
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