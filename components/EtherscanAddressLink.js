import { FaExternalLinkAlt } from 'react-icons/fa';
import metamaskService from '../redux/services/metamask.service';

const EtherscanAddressLink = ({address, showIcon}) => {
    return <a href={"https://ropsten.etherscan.io/address/"+address} target="_blank" rel="noreferrer">
        { metamaskService.getShortAddress(address) }
        {
            showIcon &&
            <small className="ms-2"><FaExternalLinkAlt /></small>
        }
    </a>
}

export default EtherscanAddressLink;