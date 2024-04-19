const { ethers } = require("ethers");
const { provider } = require("../config/ethConfig");
require("dotenv").config();

const aaveProtocolDataProviderAddress =
  process.env.AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS;
const aaveProtocolDataProviderAbi = require("../config/abi/aaveProtocolDataProvider.json");

async function getListOfReserves() {
  const contract = new ethers.Contract(
    aaveProtocolDataProviderAddress,
    aaveProtocolDataProviderAbi,
    provider
  );
  try {
    const data = await contract.getAllReservesTokens();
    return data;
  } catch (error) {
    console.error("Failed to fetch list of reserves:", error);
    throw error;
  }
}

module.exports = {
  getListOfReserves,
};
