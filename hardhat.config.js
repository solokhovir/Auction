require('@nomiclabs/hardhat-ethers');
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: __dirname + "/.env" });

// const { privateKey } = require('./secrets.json');
const { PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.7",

  networks: {
    ethereum: {
      url: "https://rpc.ankr.com/eth",
      chainId: 1,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    tron: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      contracts: "0x85eac5ac2f758618dfa09bdbe0cf174e7d574d5b",
      accounts: [`0x${PRIVATE_KEY}`],
    },
    polygon: {
      url: "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    binance: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};