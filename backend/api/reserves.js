const express = require("express");
const router = express.Router();
const { getListOfReserves, getSupplyAmounts } = require('../services/aaveService');
const { formatTokenAmounts } = require('../helpers');  // Adjust the path as necessary


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

module.exports = router;
