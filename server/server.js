const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const patientRoutes = require('./routes/patientIndexRoutes'); 
const authRoutes = require("./routes/authenticationsRoutes");
const adminRoutes = require("./routes/adminRoutes");

require('dotenv').config();
const db = require('./db');

const app = express();

// Enable CORS for the frontend origin (127.0.0.1:5500)
app.use(cors({
    origin: 'http://127.0.0.1:5500',  // Use the exact origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,  // Important for sending cookies with requests
    allowedHeaders: ['Content-Type', 'Authorization']  // Allow the necessary headers
}));


// Set up session middleware
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000, // Set session timeout to 24 hours (in milliseconds)
        httpOnly: true,  // Prevents JavaScript from accessing the cookie
        sameSite: 'strict', 
    }
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/api', authRoutes);
app.use('/api', patientRoutes);
app.use('/api', adminRoutes);


const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
