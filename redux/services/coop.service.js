const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_URI;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractCoopFactoryABI = require("../../abis/coopfactory-abi.json");
export const factoryContractAddress = "0xA8Cc9Eb159875938040A5A934a608450A1b49b17";
export const coopFactoryContract = new web3.eth.Contract(
    contractCoopFactoryABI, factoryContractAddress
);

const contractCoopABI = require("../../abis/blockcoop-abi.json");

class CoopService {
    async createCOOP(address, name, symbol, votingPeriod, gracePeriod, quorum, supermajority, membershipFee) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to create COOP.",
                code: 403
            };
        }
        const value = 0;
        const data = coopFactoryContract.methods.createCoop(name, symbol, votingPeriod, gracePeriod, quorum, supermajority, membershipFee).encodeABI();
        const response = await this.sendTransaction(address, factoryContractAddress, data, value);
        return response;
    }

    async sendTransaction(address, contractAddress, data, value) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet",
                code: 403
            };
        }
      
        const transactionParameters = {
            to: contractAddress,
            from: address,
            data: data,
            value: value
        };
      
        try {
            const txHash = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [transactionParameters],
            });
      
            return {
                status: txHash,
                code: 200
            }
      
        } catch (error) {
            console.log(error.message)
            return {
                status: "😥 " + error.message,
                code: 403
            };
        }
    }
}

export default new CoopService();