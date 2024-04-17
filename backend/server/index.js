const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const riskRoutes = require('./routes/risk');


app.use(express.json()); // Middleware to parse JSON bodies


// Routes setup
app.get('/api/status', (req, res) => {
  res.json({ message: "Server is running!" });
});
app.use('/api/risk', riskRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
