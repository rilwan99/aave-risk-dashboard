const express = require('express');
const router = express.Router();

router.get('/data', (req, res) => {
  res.json({ riskLevel: "High", details: "Details here" });
});

module.exports = router;
