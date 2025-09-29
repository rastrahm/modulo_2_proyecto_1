import { ethers } from 'ethers';

class WalletService {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.account = null;
        this.network = null;
    }

    async initialize() {
        try {
            if (window.ethereum) {
                this.provider = new ethers.BrowserProvider(window.ethereum);
                this.network = await this.provider.getNetwork();
                console.log('Wallet service inicializado en red:', this.network.name, this.network.chainId);
            } else {
                throw new Error('MetaMask no está instalado');
            }
        } catch (error) {
            console.error('Error inicializando WalletService:', error);
            throw error;
        }
    }

    /**
     * Conecta la wallet del usuario
     * @returns {Promise<Object>} - Información de la cuenta conectada
     */
    async connectWallet() {
        try {
            if (!window.ethereum) {
                throw new Error('MetaMask no está instalado');
            }

            // Solicitar acceso a las cuentas
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            if (accounts.length === 0) {
                throw new Error('No se encontraron cuentas');
            }

            this.account = accounts[0];
            this.signer = await this.provider.getSigner();

            // Verificar la red correcta
            await this.checkNetwork();

            return {
                account: this.account,
                balance: await this.getBalance(),
                network: this.network
            };

        } catch (error) {
            console.error('Error conectando wallet:', error);
            throw error;
        }
    }

    /**
     * Verifica que estemos en la red correcta
     * @returns {Promise<void>}
     */
    async checkNetwork() {
        try {
            const expectedChainId = process.env.REACT_APP_NETWORK_ID || '1337';
            const currentChainId = this.network.chainId.toString();

            if (currentChainId !== expectedChainId) {
                await this.switchNetwork(expectedChainId);
            }
        } catch (error) {
            console.error('Error verificando red:', error);
            throw error;
        }
    }

    /**
     * Cambia a la red especificada
     * @param {string} chainId - ID de la cadena
     * @returns {Promise<void>}
     */
    async switchNetwork(chainId) {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${parseInt(chainId).toString(16)}` }],
            });
        } catch (switchError) {
            // Si la red no existe, intentar agregarla
            if (switchError.code === 4902) {
                await this.addNetwork(chainId);
            } else {
                throw switchError;
            }
        }
    }

    /**
     * Agrega una nueva red
     * @param {string} chainId - ID de la cadena
     * @returns {Promise<void>}
     */
    async addNetwork(chainId) {
        const networkConfig = this.getNetworkConfig(chainId);

        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkConfig],
        });
    }

    /**
     * Obtiene la configuración de red
     * @param {string} chainId - ID de la cadena
     * @returns {Object} - Configuración de la red
     */
    getNetworkConfig(chainId) {
        const configs = {
            '1337': {
                chainId: '0x539', // 1337 en hex
                chainName: 'Hardhat Local',
                nativeCurrency: {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    decimals: 18,
                },
                rpcUrls: ['http://127.0.0.1:8545'],
                blockExplorerUrls: null,
            },
            '31337': {
                chainId: '0x7A69', // 31337 en hex
                chainName: 'Hardhat Network',
                nativeCurrency: {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    decimals: 18,
                },
                rpcUrls: ['http://127.0.0.1:8545'],
                blockExplorerUrls: null,
            }
        };

        return configs[chainId] || configs['1337'];
    }

    /**
     * Obtiene el balance de ETH de la cuenta
     * @returns {Promise<string>} - Balance en ETH
     */
    async getBalance() {
        try {
            if (!this.account) {
                throw new Error('No hay cuenta conectada');
            }

            const balance = await this.provider.getBalance(this.account);
            return ethers.formatEther(balance);
        } catch (error) {
            console.error('Error obteniendo balance:', error);
            throw error;
        }
    }

    /**
     * Obtiene el balance de tokens EURO
     * @param {string} tokenAddress - Dirección del contrato del token
     * @returns {Promise<string>} - Balance en tokens EURO
     */
    async getTokenBalance(tokenAddress) {
        try {
            if (!this.account) {
                throw new Error('No hay cuenta conectada');
            }

            const tokenContract = new ethers.Contract(
                tokenAddress, ['function balanceOf(address owner) view returns (uint256)'],
                this.provider
            );

            const balance = await tokenContract.balanceOf(this.account);
            return ethers.formatEther(balance);
        } catch (error) {
            console.error('Error obteniendo balance de tokens:', error);
            throw error;
        }
    }

    /**
     * Envía una transacción
     * @param {Object} transaction - Objeto de transacción
     * @returns {Promise<Object>} - Resultado de la transacción
     */
    async sendTransaction(transaction) {
        try {
            if (!this.signer) {
                throw new Error('No hay signer disponible');
            }

            const tx = await this.signer.sendTransaction(transaction);
            const receipt = await tx.wait();

            return {
                hash: tx.hash,
                receipt: receipt,
                success: receipt.status === 1
            };
        } catch (error) {
            console.error('Error enviando transacción:', error);
            throw error;
        }
    }

    /**
     * Firma un mensaje
     * @param {string} message - Mensaje a firmar
     * @returns {Promise<string>} - Firma del mensaje
     */
    async signMessage(message) {
        try {
            if (!this.signer) {
                throw new Error('No hay signer disponible');
            }

            return await this.signer.signMessage(message);
        } catch (error) {
            console.error('Error firmando mensaje:', error);
            throw error;
        }
    }

    /**
     * Obtiene información de la cuenta
     * @returns {Object} - Información de la cuenta
     */
    getAccountInfo() {
        return {
            account: this.account,
            network: this.network,
            isConnected: !!this.account
        };
    }

    /**
     * Desconecta la wallet
     */
    disconnect() {
        this.account = null;
        this.signer = null;
    }

    /**
     * Escucha cambios en la cuenta
     * @param {Function} callback - Función a ejecutar cuando cambie la cuenta
     */
    onAccountsChanged(callback) {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', callback);
        }
    }

    /**
     * Escucha cambios en la red
     * @param {Function} callback - Función a ejecutar cuando cambie la red
     */
    onChainChanged(callback) {
        if (window.ethereum) {
            window.ethereum.on('chainChanged', callback);
        }
    }

    /**
     * Remueve todos los listeners
     */
    removeAllListeners() {
        if (window.ethereum) {
            window.ethereum.removeAllListeners('accountsChanged');
            window.ethereum.removeAllListeners('chainChanged');
        }
    }

    /**
     * Verifica si MetaMask está instalado
     * @returns {boolean} - True si MetaMask está instalado
     */
    isMetaMaskInstalled() {
        return !!window.ethereum;
    }

    /**
     * Obtiene la versión de MetaMask
     * @returns {string} - Versión de MetaMask
     */
    getMetaMaskVersion() {
        return window.ethereum?.version || 'unknown';
    }

    /**
     * Solicita permisos adicionales
     * @param {Array} permissions - Array de permisos a solicitar
     * @returns {Promise<Object>} - Resultado de la solicitud
     */
    async requestPermissions(permissions) {
        try {
            if (!window.ethereum) {
                throw new Error('MetaMask no está instalado');
            }

            return await window.ethereum.request({
                method: 'wallet_requestPermissions',
                params: permissions
            });
        } catch (error) {
            console.error('Error solicitando permisos:', error);
            throw error;
        }
    }
}

export const walletService = new WalletService();