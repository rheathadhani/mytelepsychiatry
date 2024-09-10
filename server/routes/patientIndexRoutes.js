// routes/patientRoutes.js
const express = require('express');
const { getPatientName, getUpcomingSessions, getMedicationsList, getPastAppointments,  getAvailablePsychiatrists, trackSymptoms, getSymptomsHistory } = require('../controllers/patientindexController');

const router = express.Router();

router.get('/patient/:patientId/patient-name', getPatientName);
router.get('/patient/:patientId/upcoming-sessions', getUpcomingSessions);
router.get('/patient/:patientId/medications', getMedicationsList);
router.get('/patient/:patientId/past-appointments', getPastAppointments);
router.get('/available-psychiatrists', getAvailablePsychiatrists);
router.post('/patient/:patientId/track-symptoms', trackSymptoms);
router.get('/patient/:patientId/symptoms-history', getSymptomsHistory);

module.exports = router;
