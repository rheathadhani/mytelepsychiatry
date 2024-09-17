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
    upload,
    getExerciseContent,
    getMindfulnessContent,
    getNutritionContent
} = require('../controllers/patientindexController');

const router = express.Router();

// Patient details routes with patientId in URL params
router.get('/patient/:patientId/patient-name', getPatientName);
router.get('/patient/:patientId/upcoming-sessions', getUpcomingSessions);
router.get('/patient/:patientId/medications', getMedicationsList);
router.get('/patient/:patientId/past-appointments', getPastAppointments);

// Psychiatrist-related routes
router.post('/patient/available-psychiatrists', getAvailablePsychiatrists);
router.get('/patient/psychiatrist-profile/:psychiatristId', getPsychiatristProfile);

// Appointment-related routes
router.get('/patient/appointment-details/:appointmentId', getAppointmentDetails);

// Payment-related routes
router.post('/patient/payment', upload.single('paymentProof'), postPaymentDetails);
router.get('/patient/payment-details/:appointmentId', getPaymentDetails);


// Symptom tracking routes with patientId in URL params
router.post('/patient/:patientId/track-symptoms', trackSymptoms);
router.get('/patient/:patientId/symptoms-history', getSymptomsHistory)

// Route to get mindfulness content
router.get('/wellness-content/mindfullness', getMindfulnessContent);

// Route to get exercise content
router.get('/wellness-content/exercise', getExerciseContent);

// Route to get nutrition content
router.get('/wellness-content/nutrition', getNutritionContent);

module.exports = router;
