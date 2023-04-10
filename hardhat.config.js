require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.3",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: {
        mnemonic: process.env.MNEMONIC,
        path: "m/44'/60'/0'/0",
      },
      chainId: 592,
    },
    shiden: {
      url: "https://shiden.api.onfinality.io/public",
      accounts: {
        mnemonic: process.env.MNEMONIC,
        path: "m/44'/60'/0'/0",
      },
      chainId: 336,
      urls: {
        apiURL: "https://blockscout.com/shiden/api",
        browserURL: "https://blockscout.com/shiden",
      },
    },
  },
  etherscan: {
    apiKey: {
      shiden: process.env.ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "shiden",
        chainId: 336,
        urls: {
          apiURL: "https://blockscout.com/poa/sokol/api",
          browserURL: "https://blockscout.com/poa/sokol",
        },
      },
    ],
  },
  mocha: {
    timeout: 100000,
  },
};
