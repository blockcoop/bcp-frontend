import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { Badge, Card, Col, Container, ListGroup, Nav, Placeholder, Row } from "react-bootstrap";
import { FaCube, FaExternalLinkAlt, FaTasks, FaUserFriends } from "react-icons/fa";
import { connect } from "react-redux";
import CoopDetails from "../../components/coop/CoopDetails";
import JoinCoop from "../../components/coop/JoinCoop";
import Groups from "../../components/groups/Groups";
import Tasks from "../../components/tasks/Tasks";
import coopService from "../../redux/services/coop.service";
import groupsService from "../../redux/services/groups.service";

const Coop = (props) => {
    const router = useRouter()
    const { coopAddress } = router.query

    const [coop, setCoop] = useState(null)
    const [isCoopMember, setIsCoopMember] = useState(null)
    const [groups, setGroups] = useState(null)
    const [activeSection, setActiveSection] = useState('details')

    const loadCoopDetails = async () => {
        coopService.getCoopDetails(coopAddress).then(async (coopDetails) => {
            setCoop(coopDetails)
        })
    }

    const loadGroups = async () => {
        const grps = await groupsService.getCoopGroups(coopAddress);
        setGroups(grps);
    };

    const loadCoopMembership = async () => {
        const isMember = await coopService.isCoopMember(props.metamask.address, coopAddress);
        setIsCoopMember(isMember);
    }

    const handleActiveSection = (section) => {
        setActiveSection(section);
        if(groups === null && (section == 'groups' || section == 'tasks')) {
            loadGroups();
        }
    }

    useEffect(() => {
        if(coopAddress) {
            loadCoopDetails();
        }
    }, [coopAddress])

    useEffect(() => {
        if(coopAddress) {
            if(props.metamask.address != "") {
                loadCoopMembership();
            }
        }
    }, [coopAddress, props.metamask.address])

    return <Container className="main-content">
        <Row>
            <Col md="3" lg="2" className="d-md-block sidebar">
                <Nav className="flex-column" onSelect={(eventKey) => handleActiveSection(eventKey)}>
                    <Nav.Link eventKey="details" className={activeSection == 'details' ? 'active' : ''}>
                        <FaCube /> {" "}
                        Details
                    </Nav.Link>
                    <Nav.Link eventKey="groups">
                        <FaUserFriends /> {" "}
                        Groups
                    </Nav.Link>
                    <Nav.Link eventKey="tasks">
                        <FaTasks /> {" "}
                        Tasks
                    </Nav.Link>
                </Nav>
            </Col>
            <Col md="9" lg="10">
                {
                    coop ?
                    <>
                        <h2 className="fw-bold mb-5">{coop.name} <small className="text-muted">({coop.symbol})</small></h2>
                        <div className="mb-5">
                            {
                                activeSection == 'details' &&
                                <CoopDetails coop={coop} isCoopMember={isCoopMember} />
                            }
                            {
                                activeSection == 'groups' &&
                                <Groups coopAddress={coopAddress} coopInitiator={coop.coopInitiator} groups={groups} loadGroups={loadGroups} isCoopMember={isCoopMember} />
                            }
                            {
                                activeSection == 'tasks' &&
                                <Tasks coopAddress={coopAddress} coopInitiator={coop.coopInitiator} groups={groups} isCoopMember={isCoopMember} />
                            }
                            {
                                coop !== null && isCoopMember !== null && !isCoopMember &&
                                <JoinCoop coop={coop} loadCoopMembership={loadCoopMembership} />
                            }
                        </div>
                    </> :
                    <>
                        <Placeholder className="fw-bold mb-5" as={Card.Title} animation="glow">
                            <Placeholder size="lg" xs={6} />
                        </Placeholder>
                        <Row>
                            <Col sm="6">
                                <Placeholder className="mb-3" as='h4' animation="glow">
                                    <Placeholder xs={6} />
                                </Placeholder>
                                <Placeholder as="p" animation="glow">
                                    <Placeholder xs={8} />
                                </Placeholder>
                                <Placeholder as="p" animation="glow">
                                    <Placeholder xs={8} />
                                </Placeholder>
                                <Placeholder as="p" animation="glow">
                                    <Placeholder xs={8} />
                                </Placeholder>
                                <Placeholder as="p" animation="glow">
                                    <Placeholder xs={8} />
                                </Placeholder>
                            </Col>
                            <Col sm="6">
                                
                            </Col>
                        </Row>
                    </>
                }
            </Col>
        </Row>
        
    </Container>
}

function mapStateToProps(state) {
    const { metamask } = state;
    return {
        metamask,
    }
}

export default connect(mapStateToProps)(Coop);