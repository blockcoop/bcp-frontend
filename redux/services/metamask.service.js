const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_URI;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
class MetaMaskService {

    async connectWallet() {
        if (window.ethereum) {
            try {
                const addressArray = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                const chainId = await  window.ethereum.request({ method: 'eth_chainId' });
                return {
                    address: addressArray[0],
                    chainId: chainId,
                    status: "CONNECTED"
                }
            } catch (err) {
                return {
                    address: "",
                    chainId: "",
                    status: "UNKNOWN_ERROR"
                }
            }
        } else {
            return {
                address: "",
                chainId: "",
                status: "NO_METAMASK"
            }
        }
    }

    async changeNetwork() {
        if (window.ethereum) {
            const chainId = '3';
            if (window.ethereum.networkVersion !== chainId) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x3' }]
                    });
                    const addressArray = await window.ethereum.request({
                        method: "eth_requestAccounts",
                    });
                    const chainId = await  window.ethereum.request({ method: 'eth_chainId' });
                    return {
                        address: addressArray[0],
                        chainId: chainId,
                        status: "CONNECTED"
                    }
                } catch (error) {
                    console.log(error);
                    const addressArray = await window.ethereum.request({
                        method: "eth_requestAccounts",
                    });
                    const chainId = await  window.ethereum.request({ method: 'eth_chainId' });
                    return {
                        address: addressArray[0],
                        chainId: chainId,
                        status: "CONNECTED"
                    }
                }
            }
        } else {
            return {
                address: "",
                chainId: "",
                status: "NO_METAMASK"
            }
        }
    }

    async disconnectWallet() {
        if (window.ethereum) {
            try {
                await window.ethereum.request({
                    method: "wallet_requestPermissions",
                    params: [{
                        eth_accounts: {}
                    }]
                });
                return {
                    address: "",
                    chainId: "",
                    status: "DISCONNECTED"
                }
            } catch (err) {
                return {
                    address: "",
                    chainId: "",
                    status: "UNKNOWN_ERROR"
                }
            }
        } else {
            return {
                address: "",
                chainId: "",
                status: "NO_METAMASK"
            }
        }
    }

    async getCurrentWalletConnect() {
        if (window.ethereum) {
            try {
                const addressArray = await window.ethereum.request({
                    method: "eth_accounts",
                });
                if (addressArray.length > 0) {
                    const chainId = await  window.ethereum.request({ method: 'eth_chainId' });
                    return {
                        address: web3.utils.toChecksumAddress(addressArray[0]),
                        chainId: chainId,
                        status: "CONNECTED"
                    }
                } else {
                    return {
                        address: "",
                        chainId: "",
                        status: "NOT_CONNECTED"
                    }
                }
            } catch (err) {
                return {
                    address: "",
                    chainId: "",
                    status: "UNKNOWN_ERROR"
                }
            }
    
        } else {
            return {
                address: "",
                chainId: "",
                status: "NO_METAMASK"
            }
        }
    }

    async getEthBalance(address) {
        const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [address, 'latest'],
        });
        return web3.utils.fromWei(balance);
    }

}

export default new MetaMaskService();