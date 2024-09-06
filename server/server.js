// server.js
const express = require('express');
const bodyParser = require('body-parser');
const patientRoutes = require('./routes/patientIndexRoutes'); // Use the correct case

require('dotenv').config();
const db = require('./db'); // Ensure the database is connected

const app = express();
app.use(bodyParser.json());

// Use patient routes
app.use('/api', patientRoutes);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
