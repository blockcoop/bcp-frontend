const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_URI;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractGroupsABI = require("../../abis/groups-abi.json");
export const groupsContractAddress = "0x3cbc9F00856D16B9aCDf4a9c82514001f8849213";
export const groupsContract = new web3.eth.Contract(
    contractGroupsABI, groupsContractAddress
);

class GroupsService {
    async getCoopGroups(coopAddress) {
        const groupIds = await groupsContract.methods.getCoopGroups(coopAddress).call();
        console.log(groupIds);
        var groups = [];
        
        for (const groupId of groupIds) {
            const groupDetails = await groupsContract.methods.getGroupDetails(groupId).call();
            console.log(groupDetails);
            groups.push({
                id: groupId,
                name: groupDetails.name,
                members: groupDetails.members,
                moderators: groupDetails.moderator
            })
        }
        
        return groups;
    }

    async createGroup(address, coopAddress, name) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to create Group.",
                code: 403
            };
        }
        const value = 0;
        const data = groupsContract.methods.createGroup(coopAddress, name).encodeABI();
        const response = await this.sendTransaction(address, groupsContractAddress, data, value);
        return response;
    }

    async joinGroup(address, coopAddress, groupId) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to join Group.",
                code: 403
            };
        }
        const value = 0;
        const data = groupsContract.methods.joinGroup(coopAddress, groupId).encodeABI();
        const response = await this.sendTransaction(address, groupsContractAddress, data, value);
        return response;
    }

    async assignModerator(address, coopAddress, groupId, moderator) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to assigned Group moderator.",
                code: 403
            };
        }
        console.log(address)
        console.log(coopAddress)
        console.log(groupId)
        console.log(moderator)
        const value = 0;
        const data = groupsContract.methods.assignModerator(coopAddress, groupId, moderator).encodeABI();
        const response = await this.sendTransaction(address, groupsContractAddress, data, value);
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

export default new GroupsService();