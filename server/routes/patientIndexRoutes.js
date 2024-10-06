const express = require('express');
const { 
    getPatientName, 
    getUpcomingSessions, 
    getMedicationsList, 
    getPastAppointments, 
    getPsychiatristsVisited,
    getConsultation,
    getTotalMedicationReceived,
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
    getNutritionContent,
    getPersonalDetails,    // Newly added controller
    patchPersonalDetails,  // Newly added controller
    patchPassword,         // Newly added controller
    deleteAccount          // Newly added controller
} = require('../controllers/patientindexController');

const router = express.Router();

// Patient details routes with patientId in URL params
router.get('/patient/:patientId/patient-name', getPatientName);
router.get('/patient/:patientId/upcoming-sessions', getUpcomingSessions);
router.get('/patient/:patientId/medications', getMedicationsList);
router.get('/patient/:patientId/past-appointments', getPastAppointments);
router.get('/patient/:patientId/psychiatrists-visited', getPsychiatristsVisited);
router.get('/patient/:patientId/consultations', getConsultation);
router.get('/patient/:patientId/medications-received', getTotalMedicationReceived);

// Routes for managing patient account
router.get('/patient/:patientId/personal-details', getPersonalDetails);   // Get patient details
router.patch('/patient/:patientId/personal-details', patchPersonalDetails);  // Update patient details
router.patch('/patient/:patientId/password', patchPassword);    // Update password

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
router.get('/patient/:patientId/symptoms-history', getSymptomsHistory);

// Route to get mindfulness content
router.get('/wellness-content/mindfullness', getMindfulnessContent);

// Route to get exercise content
router.get('/wellness-content/exercise', getExerciseContent);

// Route to get nutrition content
router.get('/wellness-content/nutrition', getNutritionContent);

module.exports = router;
