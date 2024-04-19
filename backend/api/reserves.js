const express = require("express");
const router = express.Router();
const { getListOfReserves } = require('../services/aaveService');

router.get('/', async (req, res) => {
  try {
      const data = await getListOfReserves();
      res.json(data);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

module.exports = router;
