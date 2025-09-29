const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "1337",
            gas: 6721975,
            gasPrice: 20000000000
        },
        localhost: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "1337"
        }
    },
    compilers: {
        solc: {
            version: "0.8.9",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        }
    },
    plugins: [
        "truffle-plugin-verify"
    ]
};