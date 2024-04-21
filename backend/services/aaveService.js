const { ethers } = require("ethers");
const { provider } = require("../config/ethConfig");
require("dotenv").config();

const aaveProtocolDataProviderAddress =
  process.env.AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS;
const aaveProtocolDataProviderAbi = require("../config/abi/aaveProtocolDataProvider.json");
const contract = new ethers.Contract(
  aaveProtocolDataProviderAddress,
  aaveProtocolDataProviderAbi,
  provider
);

async function getListOfReserves() {
  try {
    const reserveTokens = await contract.getAllReservesTokens();
    const tokenDetails = reserveTokens
      .filter(
        (tokenPair) => !["FXS", "STG", "KNC", "GHO"].includes(tokenPair[0])
      ) // Exclude paused Tokens
      .map((tokenPair) => ({
        symbol: tokenPair[0],
        address: tokenPair[1],
      }));
    return tokenDetails;
  } catch (error) {
    console.error("Failed to fetch list of reserves:", error);
    throw error;
  }
}

async function getSupplyAmounts() {
  const tokenDetails = await getListOfReserves();
  const supplyAmountPromises = tokenDetails.map((token) =>
    contract.getATokenTotalSupply(token.address).then((supplyAmount) => ({
      symbol: token.symbol,
      amount: supplyAmount,
    }))
  );
  const supplyAmounts = await Promise.all(supplyAmountPromises);
  return supplyAmounts;
}

async function getBorrowAmounts() {
  const tokenDetails = await getListOfReserves();
  const borrowAmountPromises = tokenDetails.map((token) =>
    contract.getTotalDebt(token.address).then((borrowAmount) => ({
      symbol: token.symbol,
      amount: borrowAmount,
    }))
  );
  const borrowAmounts = await Promise.all(borrowAmountPromises);
  return borrowAmounts;
}

async function getSupplyAndBorrowCaps() {
  const tokenDetails = await getListOfReserves();
  const supplyAndBorrowCapPromises = tokenDetails.map(async (token) => {
    const reserveCaps = await contract.getReserveCaps(token.address);
    return {
      symbol: token.symbol,
      borrowCap: reserveCaps[0],
      supplyCap: reserveCaps[1],
    };
  });
  const supplyAndBorrowCaps = await Promise.all(supplyAndBorrowCapPromises);

  return supplyAndBorrowCaps;
}

module.exports = {
  getListOfReserves,
  getSupplyAmounts,
  getBorrowAmounts,
  getSupplyAndBorrowCaps
};
