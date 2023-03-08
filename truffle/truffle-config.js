const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  networks: {
     development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },
     goerli: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://goerli.infura.io/v3/${process.env.INFURA_ID}`),
      network_id: 5,       // Goerli's id
     },
      mumbai: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`),
      network_id: 80001,       // Polygon Mumbai's id
     }




  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
  },

  compilers: {
    solc: {
      version: "0.8.17", // Fetch exact version from solc-bin (default: truffle's version)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: false,
         runs: 200
       },
      }
    }
  }

};