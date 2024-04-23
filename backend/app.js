const express = require('express');
const cors = require('cors');
const app = express();

// Import routes
const reservesRouter = require('./api/reserves');
app.use(cors())
app.use('/api', reservesRouter);

app.get('/', (req, res) => {
    res.send('Service is Running');
  });
  
// Catch-all for unhandled routes
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;