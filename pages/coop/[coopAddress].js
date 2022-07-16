import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { Badge, Card, Col, Container, ListGroup, Placeholder, Row } from "react-bootstrap";
import { FaExternalLinkAlt } from "react-icons/fa";
import { connect } from "react-redux";
import Groups from "../../components/groups/Groups";
import Tasks from "../../components/tasks/Tasks";
import coopService from "../../redux/services/coop.service";

const Coop = () => {
    const router = useRouter()
    const { coopAddress } = router.query

    const [coop, setCoop] = useState(null)
    const [groupId, setGroupId] = useState(0)
    const [groups, setGroups] = useState(null)

    const loadCoopDetails = async () => {
        coopService.getCoopDetails(coopAddress).then(async (coopDetails) => {
            setCoop(coopDetails)
        })
    }

    useEffect(() => {
        if(coopAddress) {
            loadCoopDetails();
        }
    }, [coopAddress])

    return <Container className="main-content">
        {
            coop ?
            <>
                <h2 className="fw-bold mb-5">{coop.name} <small className="text-muted">({coop.symbol})</small></h2>
                <Row className="mb-5">
                    <Col sm="6">
                        <h4 className="fw-bold mb-3">Details</h4>
                        <ul className="list-unstyled list-details">
                            <li>
                                <span>COOP Initiator</span>
                                <span className="fw-bold">
                                    <a href={`https://ropsten.etherscan.io/address/${coop.coopInitiator}`} target="_blank" rel="noreferrer">
                                        {String(coop.coopInitiator).substring(0, 6) + "..." + String(coop.coopInitiator).substring(38)} {" "}
                                        <small><FaExternalLinkAlt /></small>
                                    </a>
                                </span>
                            </li>
                            <li>
                                <span>Voting Period</span>
                                <span className="fw-bold">{coopService.getPeriod(coop.votingPeriod)}</span>
                            </li>
                            <li>
                                <span>Quorum</span>
                                <span className="fw-bold">{coop.quorum}%</span>
                            </li>
                            <li>
                                <span>Supermajority</span>
                                <span className="fw-bold">{coop.supermajority}%</span>
                            </li>
                            <li>
                                <span>Membership Fee</span>
                                <span className="fw-bold">{coop.membershipFee} ETH</span>
                            </li>
                        </ul>
                    </Col>
                    <Col sm="6">
                        <Groups coopAddress={coopAddress} setGroupId={setGroupId} setGroups={setGroups} coopInitiator={coop.coopInitiator} coopMembershipFee={coop.membershipFee}/>
                    </Col>
                </Row>
                {
                    groupId !== 0 &&
                    <Tasks coopAddress={coopAddress} groupId={groupId} groups={groups} />
                }
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
    </Container>
}

function mapStateToProps(state) {
    const { metamask } = state;
    return {
        metamask,
    }
}

export default connect(mapStateToProps)(Coop);