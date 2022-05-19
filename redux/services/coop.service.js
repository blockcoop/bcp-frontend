const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_URI;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractCoopFactoryABI = require("../../abis/coopfactory-abi.json");
export const factoryContractAddress = "0x1a07E67708BFF488b97C05D264656354db39A321";
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

    async getCoopAddresses() {
        const coopCount = await coopFactoryContract.methods.getCoopCount().call();
        var coopAddresses = [];
        var coopAddress;
        for (var i = (parseInt(coopCount) - 1); i >= 0; i--) {
            coopAddress = await coopFactoryContract.methods.coops(i).call();
            coopAddresses.push(coopAddress);
        }
        return coopAddresses;
    }

    async getCoopDetails(coopAddress) {
        const coopContract = this.getCoopContract(coopAddress);
        const coopDetails = {};
        coopDetails.address = coopAddress;
        coopDetails.name = await coopContract.methods.name().call();
        coopDetails.symbol = await coopContract.methods.symbol().call();
        coopDetails.coopInitiator = await coopContract.methods.coopInitiator().call();
        coopDetails.votingPeriod = await coopContract.methods.votingPeriod().call();
        coopDetails.gracePeriod = await coopContract.methods.gracePeriod().call();
        coopDetails.quorum = await coopContract.methods.quorum().call();
        coopDetails.supermajority = await coopContract.methods.supermajority().call();
        coopDetails.status = await coopContract.methods.status().call();
        coopDetails.created = await coopContract.methods.created().call();
        coopDetails.membershipFee = await coopContract.methods.membershipFee().call();
        coopDetails.members = await coopContract.methods.getMembers().call();
        return coopDetails;
    }

    async getMemberCoops(address) {
        const coopAddresses = await coopFactoryContract.methods.getCoopsByMember(address).call({from: address});
        return coopAddresses;
    }

    async joinCoop(address, coopAddress) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to join COOP.",
                code: 403
            };
        }
        const coopContract = this.getCoopContract(coopAddress);
        const value = 0;
        const data = coopContract.methods.joinCoop().encodeABI();
        const response = await this.sendTransaction(address, coopAddress, data, value);
        return response;
    }

    getPeriod(seconds) {
        var seconds = parseInt(seconds, 10);
        var days = Math.floor(seconds / (3600*24));
        seconds  -= days*3600*24;
        var hrs   = Math.floor(seconds / 3600);
        seconds  -= hrs*3600;
        var mnts = Math.floor(seconds / 60);
        seconds  -= mnts*60;
        var period = ""
        if(days !== 0) {
            period += days+" days";
        }
        if(hrs !== 0) {
            period += hrs+" hrs";
        }
        return period;
    }

    getCoopContract(coopAddress) {
        return new web3.eth.Contract(
            contractCoopABI,
            coopAddress
        );
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