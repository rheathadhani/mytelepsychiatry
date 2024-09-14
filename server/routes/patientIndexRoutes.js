// routes/patientRoutes.js
const express = require('express');
const { 
    getPatientName, 
    getUpcomingSessions, 
    getMedicationsList, 
    getPastAppointments, 
    getAvailablePsychiatrists, 
    getPsychiatristProfile, 
    getAppointmentDetails, 
    postPaymentDetails, 
    getPaymentDetails, 
    trackSymptoms, 
    getSymptomsHistory, 
    upload 
} = require('../controllers/patientindexController');

const router = express.Router();

// Patient details routes
router.get('/patient/patient-name', getPatientName);
router.get('/patient/upcoming-sessions', getUpcomingSessions);
router.get('/patient/medications', getMedicationsList);
router.get('/patient/past-appointments', getPastAppointments);

// Psychiatrist-related routes
router.post('/patient/available-psychiatrists', getAvailablePsychiatrists);
router.get('/patient/psychiatrist-profile/:psychiatristId', getPsychiatristProfile);

// Appointment-related routes
router.get('/patient/appointment-details/:appointmentId', getAppointmentDetails);

// Payment-related routes
router.post('/patient/payment', upload.single('paymentProof'), postPaymentDetails);
router.get('/patient/payment-details/:appointmentId', getPaymentDetails);

// Symptom tracking routes
router.post('/patient/track-symptoms', trackSymptoms);
router.get('/patient/symptoms-history', getSymptomsHistory);

module.exports = router;
