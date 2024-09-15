const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const patientRoutes = require('./routes/patientIndexRoutes'); 
const authRoutes = require("./routes/authenticationsRoutes");

require('dotenv').config();
const db = require('./db');

const app = express();

// Enable CORS for the frontend origin (127.0.0.1:5500)
app.use(cors({
    origin: 'http://127.0.0.1:5500', // The front-end origin
    methods: ['GET', 'POST'], // The methods you want to allow
    credentials: true, // This allows cookies or sessions to be sent
    allowedHeaders: ['Content-Type', 'Authorization'] // The headers you expect to be sent
}));

// Set up session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api', patientRoutes);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
