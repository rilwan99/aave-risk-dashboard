const express = require("express");
const router = express.Router();
const { getListOfReserves, getSupplyAmounts, getBorrowAmounts, getSupplyAndBorrowCaps, getLatestTimestamp, getReserveConfig, aggregateAllData, getAggregatedData } = require('../services/aaveService');
const { getTokenPrices } = require('../services/priceService')
const { formatTokenAmounts, formatReserveCaps, formatReserveConfig } = require('../helpers');  // Adjust the path as necessary


router.get('/', async (req, res) => {
  try {
      const data = await getListOfReserves();
      res.json(data);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.get('/supply', async (req, res) => {
  try {
      const data = await getSupplyAmounts();
      const formattedTokenAmount = formatTokenAmounts(data)
      res.json(formattedTokenAmount);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.get('/borrow', async (req, res) => {
  try {
      const data = await getBorrowAmounts();
      const formattedTokenAmount = formatTokenAmounts(data)
      res.json(formattedTokenAmount);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.get('/caps', async (req, res) => {
  try {
      const data = await getSupplyAndBorrowCaps();
      const formattedReserveCaps = formatReserveCaps(data)
      res.json(formattedReserveCaps);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.get('/prices', async (req, res) => {
  try {
      const data = await getTokenPrices();
      res.json(data);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.get('/timestamp', async (req, res) => {
  try {
      // Fetch the latest timestamp and the block number on etheruem
      const data = await getLatestTimestamp()
      console.log('/timestamp invoked')
      res.json(data);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.get('/reserveConfig', async (req, res) => {
  try {
      // Fetch the latest timestamp and the block number on etheruem
      const data = await getReserveConfig()
      const formattedReserveConfig = formatReserveConfig(data)
      res.json(formattedReserveConfig);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.get('/overview', async (req, res) => {
  try {
      const data = await getAggregatedData()
      console.log('/overview invoked')
      res.json(data);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

module.exports = router;
