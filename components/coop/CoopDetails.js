import coopService from "../../redux/services/coop.service";
import EtherscanAddressLink from "../EtherscanAddressLink";

const CoopDetails = (props) => {
    return (
        <>
            <h4 className="fw-bold mb-3">Details</h4>
            <ul className="list-unstyled list-details">
                <li>
                    <span>COOP Initiator</span>
                    <span className="fw-bold">
                        <EtherscanAddressLink address={props.coop.coopInitiator} showIcon={true} />
                    </span>
                </li>
                <li>
                    <span>Voting Period</span>
                    <span className="fw-bold">{coopService.getPeriod(props.coop.votingPeriod)}</span>
                </li>
                <li>
                    <span>Quorum</span>
                    <span className="fw-bold">{props.coop.quorum}%</span>
                </li>
                <li>
                    <span>Supermajority</span>
                    <span className="fw-bold">{props.coop.supermajority}%</span>
                </li>
                <li>
                    <span>Membership Fee</span>
                    <span className="fw-bold">{props.coop.membershipFee} ETH</span>
                </li>
                {
                    props.coop.country &&
                    <li>
                        <span>Country</span>
                        <span className="fw-bold">{props.coop.country}</span>
                    </li>
                }
            </ul>
        </>
    )
}

export default CoopDetails;