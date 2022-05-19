import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import CoopCard from "../components/CoopCard";
import Wallet from "../components/Wallet"
import coopService from "../redux/services/coop.service";

const Portfolio = (props) => {

    const [coops, setCoops] = useState(null)

    useEffect(() => {
        if(props.metamask.address) {
            coopService.getMemberCoops(props.metamask.address).then(response => {
                setCoops(response)
            })
        }
    }, [props.metamask.address])

    return (
        <>
        {
            props.metamask.address === '' ?
            <Container className="main-content align-items-center d-flex">
                <div className="text-center" style={{width: '100%', marginBottom: '100px;'}}>
                    <h2 className="mb-3">Please connect wallet</h2>
                    <Wallet />
                </div> 
            </Container>: 
            <Container className="main-content">
                {
                    coops ?
                    <>
                    {
                        coops.length !== 0 ?
                        <Row className="mt-5 view-coops">
                            { coops.map(function(coopAddress, i) {
                                return <Col xl="3" lg="4" md="6" key={i}>
                                    <CoopCard coopAddress={coopAddress} />
                                </Col>
                            }) }
                        </Row> :
                        <h2 className="text-primary text-center mt-5">You don&apos;t have COOPs in your Portfolio</h2>
                    }
                    </> :
                    <>Loading</>
                }
            </Container>
        }
        </>
    )
}

function mapStateToProps(state) {
    const { metamask } = state;
    return {
        metamask,
    }
}

export default connect(mapStateToProps)(Portfolio);