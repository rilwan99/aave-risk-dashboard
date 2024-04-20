const axios = require("axios");
require("dotenv").config();
const { getListOfReserves } = require("./aaveService");

async function getTokenPrices() {
  const apiKey = process.env.COINMARKETCAP_API_KEY;
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest`;

  try {
    const reserves = await getListOfReserves();
    const symbols = reserves
      .map((token) => {
        return token.symbol;
      })
      .join(",");

    const response = await axios.get(url, {
      params: {
        symbol: symbols,
        convert: "USD",
      },
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
        Accept: "application/json",
      },
    });

    // NOTE: weETH & cbETH are omitted from being converted to upper case
    //  to match coinmarketcap api convention

    // Extracting only price data form API response
    const prices = reserves.map((reserve) => ({
      symbol: reserve.symbol,
      price: response.data.data[
        reserve.symbol === "weETH" || reserve.symbol === "cbETH"
          ? reserve.symbol
          : reserve.symbol.toUpperCase()
      ]
        ? response.data.data[
            reserve.symbol === "weETH" || reserve.symbol === "cbETH"
              ? reserve.symbol
              : reserve.symbol.toUpperCase()
          ].quote.USD.price
        : "No price available",
    }));

    return prices;
  } catch (error) {
    console.error(
      `Failed to fetch prices for symbols: ${symbols}`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

module.exports = {
  getTokenPrices,
};
