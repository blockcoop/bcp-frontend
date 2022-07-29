const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_URI;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractFactoryABI = require("../../abis/factory-abi.json");
export const factoryContractAddress = "0x2ce6Bf32b724482430178286A60120B6a3FdeEc3";
export const factoryContract = new web3.eth.Contract(
    contractFactoryABI, factoryContractAddress
);

const contractCoopABI = require("../../abis/coop-abi.json");

class CoopService {
    async isCoopMember(address, coopAddress) {
        const coopContract = this.getCoopContract(coopAddress);
        const balance = await coopContract.methods.balanceOf(address).call();
        return (balance > 0);
    }

    async createCOOP(address, name, symbol, votingPeriod, quorum, supermajority, membershipFee, country) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to create COOP.",
                code: 403
            };
        }
        const value = 0;
        const fee = (membershipFee > 0) ? web3.utils.toWei((membershipFee).toString(), 'ether') : 0;
        const data = factoryContract.methods.createCoop(name, symbol, votingPeriod, quorum, supermajority, fee, country).encodeABI();
        const response = await this.sendTransaction(address, factoryContractAddress, data, value);
        return response;
    }

    async getCoopAddresses() {
        const coopCount = await factoryContract.methods.getCoopCount().call();
        var coopAddresses = [];
        var coopAddress;
        for (var i = (parseInt(coopCount) - 1); i >= 0; i--) {
            coopAddress = await factoryContract.methods.coops(i).call();
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
        // coopDetails.gracePeriod = await coopContract.methods.gracePeriod().call();
        coopDetails.quorum = await coopContract.methods.quorum().call();
        coopDetails.supermajority = await coopContract.methods.supermajority().call();
        coopDetails.status = await coopContract.methods.status().call();
        coopDetails.created = await coopContract.methods.created().call();
        coopDetails.membershipFee = await coopContract.methods.membershipFee().call();
        coopDetails.country = await coopContract.methods.country().call();
        if(coopDetails.membershipFee > 0) {
            coopDetails.membershipFee = web3.utils.fromWei(coopDetails.membershipFee);
        }
        // coopDetails.members = await coopContract.methods.getMembers().call();
        coopDetails.members = [];
        return coopDetails;
    }

    async getGroups(coopAddress, checkMember=false, address=null) {
        const coopContract = this.getCoopContract(coopAddress);
        const count = await coopContract.methods.getGroupCount().call();
        let groups = []
        for(let i=1; i<=count; i++) {
            let name = await coopContract.methods.getGroupNameById(i).call();
            let size = await coopContract.methods.getMemberCount(i).call();
            let memberFound = false;
            if(checkMember && address) {
                let isMember = false;
                if(!memberFound) {
                    isMember = await coopContract.methods.isGroupMember(address, i).call();
                }
                
                groups.push({
                    id: i,
                    name: name,
                    size: parseInt(size),
                    isMember: isMember
                })
            } else {
                groups.push({
                    id: i,
                    name: name,
                    size: parseInt(size)
                })
            }
        }
        console.log(groups);
        return groups;
    }

    

    async getMemberCoops(address) {
        const coopAddresses = await factoryContract.methods.getCoopsByMember(address).call({from: address});
        return coopAddresses;
    }

    async joinCoop(address, coopAddress, membershipFee) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to join COOP.",
                code: 403
            };
        }
        const coopContract = this.getCoopContract(coopAddress);
        const value = (membershipFee > 0) ? parseInt(web3.utils.toWei((membershipFee).toString(), 'ether')).toString(16) : 0;
        const data = coopContract.methods.joinCoop().encodeABI();
        const response = await this.sendTransaction(address, coopAddress, data, value);
        return response;
    }

    async createTask(address, coopAddress, details, votingDeadline, taskDeadline) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to create task.",
                code: 403
            };
        }
        const coopContract = this.getCoopContract(coopAddress);
        const value = 0;
        const data = coopContract.methods.createTask(details, votingDeadline, taskDeadline).encodeABI();
        const response = await this.sendTransaction(address, coopAddress, data, value);
        return response;
    }

    async getTaskCount(coopAddress) {
        const coopContract = this.getCoopContract(coopAddress);
        return await coopContract.methods.getTaskCount().call();
    }

    async getTask(coopAddress, taskId) {
        const coopContract = this.getCoopContract(coopAddress);
        return await coopContract.methods.getTask(taskId).call();
    }

    async participate(address, coopAddress, taskId) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to join participate.",
                code: 403
            };
        }
        const coopContract = this.getCoopContract(coopAddress);
        const value = 0;
        const data = coopContract.methods.participate(taskId).encodeABI();
        const response = await this.sendTransaction(address, coopAddress, data, value);
        return response;
    }

    async vote(address, coopAddress, taskId, isYes) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to Vote.",
                code: 403
            };
        }
        const coopContract = this.getCoopContract(coopAddress);
        const value = 0;
        const data = coopContract.methods.vote(taskId, isYes).encodeABI();
        const response = await this.sendTransaction(address, coopAddress, data, value);
        return response;
    }

    async processTaskVoting(address, coopAddress, taskId) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to process voting.",
                code: 403
            };
        }
        const coopContract = this.getCoopContract(coopAddress);
        const value = 0;
        const data = coopContract.methods.processTaskVoting(taskId).encodeABI();
        const response = await this.sendTransaction(address, coopAddress, data, value);
        return response;
    }

    async processTaskCompletion(address, coopAddress, taskId, isCompleted) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to process task completion.",
                code: 403
            };
        }
        const coopContract = this.getCoopContract(coopAddress);
        const value = 0;
        const data = coopContract.methods.processTaskCompletion(taskId, isCompleted).encodeABI();
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