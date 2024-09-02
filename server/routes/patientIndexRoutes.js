// routes/patientRoutes.js
const express = require('express');
const { getPatientName, getUpcomingSessions, getMedicationsList, getPastAppointments } = require('../controllers/patientindexController');

const router = express.Router();

// Make sure this route is correct
router.get('/patient/:patientId/patient-name', getPatientName);
router.get('/patient/:patientId/upcoming-sessions', getUpcomingSessions);
router.get('/patient/:patientId/medications', getMedicationsList);
router.get('/patient/:patientId/past-appointments', getPastAppointments);

module.exports = router;
