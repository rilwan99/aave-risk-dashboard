const express = require("express");
const router = express.Router();

// Route to get current lending rates

router.get("/", (req, res) => {
  // Implementation to fetch and send lending rates
  res.json({ list: "Current list of reserves" });
});

module.exports = router;
