const { ethers } = require("ethers");
const { provider } = require("../config/ethConfig");
require("dotenv").config();

const aaveProtocolDataProviderAddress =
  process.env.AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS;
const aaveProtocolDataProviderAbi = require("../config/abi/aaveProtocolDataProvider.json");
const { getTokenPrices } = require("./priceService");
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

async function getSupplyAmounts(listOfReserves) {
  try {
    const tokenDetails = listOfReserves || (await getListOfReserves());
    const supplyAmountPromises = tokenDetails.map((token) =>
      contract.getATokenTotalSupply(token.address).then((supplyAmount) => ({
        symbol: token.symbol,
        amount: supplyAmount,
      }))
    );
    const supplyAmounts = await Promise.all(supplyAmountPromises);
    return supplyAmounts;
  } catch (error) {
    console.error("Failed to fetch supplyAmounts:", error);
    throw error;
  }
}

async function getBorrowAmounts(listOfReserves) {
  try {
    const tokenDetails = listOfReserves || (await getListOfReserves());
    const borrowAmountPromises = tokenDetails.map((token) =>
      contract.getTotalDebt(token.address).then((borrowAmount) => ({
        symbol: token.symbol,
        amount: borrowAmount,
      }))
    );
    const borrowAmounts = await Promise.all(borrowAmountPromises);
    return borrowAmounts;
  } catch (error) {
    console.error("Failed to fetch borrowAmounts:", error);
    throw error;
  }
}

async function getSupplyAndBorrowCaps(listOfReserves) {
  try {
    const tokenDetails = listOfReserves || (await getListOfReserves());
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
  } catch (error) {
    console.error("Failed to fetch reserveCaps:", error);
    throw error;
  }
}

async function getLatestTimestamp() {
  try {
    const block = await provider.getBlock("latest");
    return {
      timestamp: block.timestamp,
      blockNumber: block.number,
    };
  } catch (error) {
    console.error("Failed to fetch latest block:", error);
    throw error;
  }
}

async function getReserveConfig(listOfReserves) {
  try {
    const tokenDetails = listOfReserves || (await getListOfReserves());
    const reserveConfigPromises = tokenDetails.map(async (token) => {
      const reserveConfig = await contract.getReserveConfigurationData(
        token.address
      );
      return {
        symbol: token.symbol,
        decimals: reserveConfig.decimals,
        ltv: reserveConfig.ltv,
        liquidationThreshold: reserveConfig.liquidationThreshold,
      };
    });
    const aggragtedReserveConfig = await Promise.all(reserveConfigPromises);

    return aggragtedReserveConfig;
  } catch (error) {
    console.error("Failed to fetch reserveConfig:", error);
    throw error;
  }
}

async function getAggregatedData() {
  try {
    const reserves = await getListOfReserves();

    const [supply, borrow, caps, reserveConfig] = await Promise.all([
      getSupplyAmounts(reserves),
      getBorrowAmounts(reserves),
      getSupplyAndBorrowCaps(reserves),
      getReserveConfig(reserves),
    ]);

    // Aggregate all relevant reserve data into a single array
    const aggregatedReserveData = aggregateReserveData({
      reserves,
      supply,
      borrow,
      caps,
      reserveConfig,
    });

    const includeUtilizationRate = calculateUtilizationRate(
      aggregatedReserveData
    );

    const includeLimitsUsed = calculateLimitsUsed(includeUtilizationRate);

    const priceData = await getTokenPrices(reserves);
    const includePriceData = calculatePriceData(includeLimitsUsed, priceData);

    const formattedRiskMetrics = formatResults(includePriceData);

    console.log(formattedRiskMetrics);
    return formattedRiskMetrics;
  } catch (error) {
    console.error("Failed to aggregate data:", error);
    throw error;
  }
}

function aggregateReserveData(data) {
  const { reserves, supply, borrow, caps, reserveConfig } = data;

  // Create a map to easily find metrics for each token
  const supplyMap = new Map(supply.map((item) => [item.symbol, item.amount]));
  const borrowMap = new Map(borrow.map((item) => [item.symbol, item.amount]));

  const capsMap = new Map(
    caps.map((item) => [
      item.symbol,
      { borrowCap: item.borrowCap, supplyCap: item.supplyCap },
    ])
  );
  const configMap = new Map(
    reserveConfig.map((item) => [
      item.symbol,
      {
        decimals: item.decimals,
        ltv: item.ltv,
        liquidationThreshold: item.liquidationThreshold,
      },
    ])
  );

  // Merge all data into one array
  return reserves.map((token) => ({
    symbol: token.symbol,
    address: token.address,
    supplyAmount: supplyMap.get(token.symbol),
    borrowAmount: borrowMap.get(token.symbol),
    borrowCap: capsMap.get(token.symbol)?.borrowCap,
    supplyCap: capsMap.get(token.symbol)?.supplyCap,
    decimals: configMap.get(token.symbol)?.decimals,
    ltv: configMap.get(token.symbol)?.ltv,
    liquidationThreshold: configMap.get(token.symbol)?.liquidationThreshold,
  }));
}

function calculateUtilizationRate(data) {
  return data.map((token) => {
    const { supplyAmount, borrowAmount } = token;

    let utilizationRate = "0%";

    if (supplyAmount > 0n && borrowAmount > 0n) {
      let calculatedRate = (borrowAmount * 100n) / supplyAmount; // Express result as percentage

      if (calculatedRate < 1n) {
        utilizationRate = "<1%";
      } else {
        utilizationRate = calculatedRate.toString() + "%";
      }
    }

    return {
      ...token,
      utilizationRate,
    };
  });
}

function calculateLimitsUsed(data) {
  return data.map((token) => {
    const { supplyAmount, supplyCap, borrowAmount, borrowCap, decimals } =
      token;

    // Convert amounts to a comparable scale to caps
    const scaleFactor = BigInt(10 ** Number(decimals));

    const normalizedSupplyAmount = supplyAmount / scaleFactor;
    const normalizedBorrowAmount = borrowAmount / scaleFactor;

    let supplyLimitUsed = "0%"; // Default to 0% if supplyCap is zero
    if (supplyCap > 0n) {
      const supplyPercentage =
        (normalizedSupplyAmount * 100n) / BigInt(supplyCap); // Calculate percentage
      supplyLimitUsed =
        supplyPercentage > 0n && supplyPercentage < 1n
          ? "<1%"
          : supplyPercentage.toString() + "%";
    }

    let borrowLimitUsed = "0%"; // Default to 0% if borrowCap is zero
    if (borrowCap > 0n) {
      const borrowPercentage =
        (normalizedBorrowAmount * 100n) / BigInt(borrowCap); // Calculate percentage
      borrowLimitUsed =
        borrowPercentage > 0n && borrowPercentage < 1n
          ? "<1%"
          : borrowPercentage.toString() + "%";
    }

    return {
      ...token,
      supplyLimitUsed,
      borrowLimitUsed,
    };
  });
}

function calculatePriceData(tokenData, priceData) {
  const priceMap = new Map(priceData.map((item) => [item.symbol, item.price]));

  return tokenData.map((token) => {
    const { symbol, supplyAmount, borrowAmount, decimals } = token;
    const price = priceMap.get(symbol) || 0;

    const scaleFactor = BigInt(10 ** Number(decimals));
    const normalizedSupplyAmount = Number(supplyAmount / scaleFactor);
    const normalizedBorrowAmount = Number(borrowAmount / scaleFactor);

    // Calculate supplyValue and borrowValue using the normalized amounts
    const supplyValue = normalizedSupplyAmount * price;
    const borrowValue = normalizedBorrowAmount * price;

    return {
      ...token,
      supplyValue: supplyValue.toFixed(2),
      borrowValue: borrowValue.toFixed(2),
    };
  });
}

function formatResults(data) {
  return data.map((token) => {
    const {
      symbol,
      address,
      supplyAmount,
      borrowAmount,
      borrowCap,
      supplyCap,
      decimals,
      ltv,
      liquidationThreshold,
      utilizationRate,
      supplyLimitUsed,
      borrowLimitUsed,
      supplyValue,
      borrowValue,
    } = token;

    const formatNumber = (num) => {
      return Number(num).toLocaleString("en-US", { maximumFractionDigits: 2 });
    };

    const scaleFactor = BigInt(10 ** Number(decimals));
    const formattedSupplyAmount = formatNumber(supplyAmount / scaleFactor);
    const formattedBorrowAmount = formatNumber(borrowAmount / scaleFactor);

    const formattedLtv = (Number(ltv) / 100).toFixed(2) + "%";
    const formattedLiquidationThreshold =
      (Number(liquidationThreshold) / 100).toFixed(2) + "%";

    return {
      symbol,
      address,
      supplyAmount: formattedSupplyAmount,
      borrowAmount: formattedBorrowAmount,
      borrowCap: formatNumber(borrowCap),
      supplyCap: formatNumber(supplyCap),
      ltv: formattedLtv,
      liquidationThreshold: formattedLiquidationThreshold,
      utilizationRate,
      supplyLimitUsed,
      borrowLimitUsed,
      supplyValue: formatNumber(supplyValue),
      borrowValue: formatNumber(borrowValue),
    };
  });
}

module.exports = {
  getListOfReserves,
  getSupplyAmounts,
  getBorrowAmounts,
  getSupplyAndBorrowCaps,
  getLatestTimestamp,
  getReserveConfig,
  getAggregatedData,
};
