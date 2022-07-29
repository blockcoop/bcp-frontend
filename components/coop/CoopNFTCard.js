import Link from "next/link"
import { useEffect, useState } from "react"
import { Button, Card, Placeholder } from "react-bootstrap"
import { connect } from "react-redux"
import coopService from "../../redux/services/coop.service"

const CoopNFTCard = (props) => {
    const [coop, setCoop] = useState(null)

    useEffect(() => {
        coopService.getCoopDetails(props.coopAddress).then((coopDetails) => {
            setCoop(coopDetails)
        })
    }, [props.coopAddress])

    return <Card className="mb-4 text-center shadow coop-nft-card">
        {
            coop ?
            <Link href={`/coop/${props.coopAddress}`}>
                <Card.Body style={{width: '100%'}}>
                    <Card.Title className="fw-bold">
                        <small className="fs-6 text-muted">COOP NAME</small><br></br>
                        <div className="fs-4 mt-2">{coop.name}</div>
                        <div className="mt-4 mb-4 member-circle">
                        {
                            coop.coopInitiator == props.metamask.address ?
                            <p>CREATOR</p> : <p>MEMBER</p>
                        }
                        </div>
                        <Button variant="color" style={{ minWidth: '150px' }}>View</Button>
                    </Card.Title>
                </Card.Body>
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

export default connect(mapStateToProps)(CoopNFTCard);;