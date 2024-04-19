const ethers = require('ethers');
require('dotenv').config()

const customRpcUrl = process.env.ALCHEMY_RPC
const provider = new ethers.JsonRpcProvider(customRpcUrl);

module.exports = { provider };