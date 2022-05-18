import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, ListGroup, ListGroupItem, Placeholder } from "react-bootstrap";
import { FaExternalLinkAlt, FaUser } from "react-icons/fa";
import { connect } from "react-redux";
import coopService from "../redux/services/coop.service";

const CoopCard = (props) => {
    const [coop, setCoop] = useState(null)

    

    useEffect(() => {
        coopService.getCoopDetails(props.coopAddress).then((coopDetails) => {
            setCoop(coopDetails)
        })
    }, [props.coopAddress])

    return <Card className="mb-4 shadow">
        {
            coop ? 
            <Link href={`/coop/${props.coopAddress}`}>
                <a>
                <Card.Body style={{width: '100%'}}>
                    <Card.Title className="fw-bold">{coop.name} {""} <small className="text-muted">({coop.symbol})</small></Card.Title>
                    <div className="mb-3 mt-3">
                        <FaUser />{" "}
                        <a href={`https://ropsten.etherscan.io/address/${coop.coopInitiator}`} target="_blank" rel="noreferrer">
                            {String(coop.coopInitiator).substring(0, 6) + "..." + String(coop.coopInitiator).substring(38)} {" "}
                        </a>
                    </div>
                    <ul className="list-unstyled list-details">
                        <li>
                            <span>Voting Period</span>
                            <span className="fw-bold">{coopService.getPeriod(coop.votingPeriod)}</span>
                        </li>
                        <li>
                            <span>Grace Period</span>
                            <span className="fw-bold">{coopService.getPeriod(coop.gracePeriod)}</span>
                        </li>
                        <li>
                            <span>Membership Fee</span>
                            <span className="fw-bold">{coop.membershipFee} ETH</span>
                        </li>
                    </ul>
                </Card.Body>
                </a>
            </Link> :
            <Card.Body style={{width: '100%'}}>
                <Placeholder as={Card.Title} animation="glow">
                    <Placeholder xs={6} />
                </Placeholder>
                <Placeholder as={Card.Text} animation="glow">
                    <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                    <Placeholder xs={6} /> <Placeholder xs={8} />
                </Placeholder>
            </Card.Body>

        }
    </Card>
}

function mapStateToProps(state) {
    const { metamask } = state;
    return {
        metamask,
    }
}

export default connect(mapStateToProps)(CoopCard);