import { connect } from "react-redux";
import { Card, Col, Container, Placeholder, Row } from "react-bootstrap"
import { useEffect, useState } from "react";
import coopService from "../redux/services/coop.service";
import CoopCard from "../components/coop/CoopCard";

const ViewCoops = (props) => {

    const [coopAddresses, setCoopAddresses] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        coopService.getCoopAddresses().then((addresses) => {
            setCoopAddresses(addresses)
            setLoading(false)
        });
    }, [])

    return <Container className="main-content">
        {
            loading ?
            <Row className="mt-5 view-coops">
                { [1,2,3].map(function(spadAddress, i) {
                    return <Col xl="3" lg="4" md="6" key={i}>
                        <Card className="mb-4 shadow-lg">
                            <Card.Body style={{width: '100%'}}>
                                <Placeholder as={Card.Title} animation="glow">
                                    <Placeholder xs={6} />
                                </Placeholder>
                                <Placeholder as={Card.Text} animation="glow">
                                    <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                                    <Placeholder xs={6} /> <Placeholder xs={8} />
                                </Placeholder>
                            </Card.Body>
                        </Card>
                    </Col>
                }) }
            </Row> :
            <Row className="mt-5 view-coops">
                { coopAddresses.map(function(coopAddress, i) {
                    return <Col xl="3" lg="4" md="6" key={i}>
                        <CoopCard coopAddress={coopAddress} />
                    </Col>
                }) }
            </Row>
        }
    </Container>
}

function mapStateToProps(state) {
    const { metamask } = state;
    return {
        metamask,
    }
}

export default connect(mapStateToProps)(ViewCoops);