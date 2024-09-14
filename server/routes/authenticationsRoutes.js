const express = require('express');
const { loginUser, registerPatient } = require('../controllers/authenticationController');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerPatient);

module.exports = router;
