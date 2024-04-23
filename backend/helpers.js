function formatTokenAmounts(tokenDataArray) {
  const tokenDecimals = {
    WBTC: 8,
    USDC: 6,
    USDT: 6,
    PYUSD: 6,
  };

  return tokenDataArray.map((tokenData) => {
    const decimals = tokenDecimals[tokenData.symbol] || 18;
    const scaledAmount = BigInt(tokenData.amount) / BigInt(10 ** decimals);
    const roundedAmount = Number(scaledAmount); // Convert BigInt to Number
    return {
      symbol: tokenData.symbol,
      amount: roundedAmount,
    };
  });
}

function formatReserveCaps(reserveCaps) {
  return reserveCaps.map((reserveCap) => {
    return {
      symbol: reserveCap.symbol,
      borrowCap: Number(reserveCap.borrowCap),
      supplyCap: Number(reserveCap.supplyCap),
    };
  });
}

function formatReserveConfig(reserveConfigs) {
  return reserveConfigs.map((reserveConfig) => {
    return {
      symbol: reserveConfig.symbol,
      decimals: Number(reserveConfig.decimals),
      ltv: Number(reserveConfig.ltv),
      liquidationThreshold: Number(reserveConfig.liquidationThreshold),
    };
  });
}

module.exports = {
  formatTokenAmounts,
  formatReserveCaps,
  formatReserveConfig
};
