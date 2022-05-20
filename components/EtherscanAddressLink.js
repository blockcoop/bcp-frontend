import metamaskService from '../redux/services/metamask.service';

const EtherscanAddressLink = ({address}) => {
    return <a href={"https://ropsten.etherscan.io/address/"+address} target="_blank" rel="noreferrer">
        { metamaskService.getShortAddress(address) }
    </a>
}

export default EtherscanAddressLink;