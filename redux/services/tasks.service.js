const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_URI;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractTasksABI = require("../../abis/tasks-abi.json");
export const tasksContractAddress = "0x3Ac7082d71F779d08e661Beb283C1cCDE2812919";

export const taskContract = new web3.eth.Contract(
    contractTasksABI, tasksContractAddress
);

class TaskService {
    async getCoopTasks(coopAddress) {
        return await taskContract.methods.getCoopTasks(coopAddress).call();
    }

    async createTask(address, coopAddress, groupId, details, votingDeadline, taskDeadline) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to create task.",
                code: 403
            };
        }
        const value = 0;
        const data = taskContract.methods.createTask(coopAddress, groupId, details, votingDeadline, taskDeadline).encodeABI();
        const response = await this.sendTransaction(address, tasksContractAddress, data, value);
        return response;
    }

    async getTask(taskId) {
        return await taskContract.methods.getTask(taskId).call();
    }

    async vote(address, taskId, isYes) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to Vote.",
                code: 403
            };
        }
        const value = 0;
        const data = taskContract.methods.vote(taskId, isYes).encodeABI();
        const response = await this.sendTransaction(address, tasksContractAddress, data, value);
        return response;
    }

    async participate(address, taskId) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to participate.",
                code: 403
            };
        }
        const value = 0;
        const data = taskContract.methods.participate(taskId).encodeABI();
        const response = await this.sendTransaction(address, tasksContractAddress, data, value);
        return response;
    }

    async processTaskVoting(address, taskId) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to process voting.",
                code: 403
            };
        }
        const value = 0;
        const data = taskContract.methods.processTaskVoting(taskId).encodeABI();
        const response = await this.sendTransaction(address, tasksContractAddress, data, value);
        return response;
    }
    
    async voteTaskCompletion(address, taskId, isYes) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to Vote for task completion.",
                code: 403
            };
        }
        const value = 0;
        const data = taskContract.methods.voteTaskCompletion(taskId, isYes).encodeABI();
        const response = await this.sendTransaction(address, tasksContractAddress, data, value);
        return response;
    }

    async processTaskCompletion(address, taskId) {
        if (!window.ethereum || address === null || address === "") {
            return {
                status: "💡 Connect your Metamask wallet to process task completion.",
                code: 403
            };
        }
        const value = 0;
        const data = taskContract.methods.processTaskCompletion(taskId).encodeABI();
        const response = await this.sendTransaction(address, tasksContractAddress, data, value);
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

export default new TaskService();