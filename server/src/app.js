const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const incidentRoutes = require('./routes/incidentRoutes');
const locationRoutes = require('./routes/locationRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/v1/incidents', incidentRoutes);
app.use('/api/v1/locations', locationRoutes);

// Error Handling
app.use(errorHandler);

module.exports = app;