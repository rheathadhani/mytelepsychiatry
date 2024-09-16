const express = require('express');
const router = express.Router();

const {
    addNewPsychiatrist,
    getPsychiatrists,
    editPsychiatrist,
    deletePsychiatrist,
    getPatientById,
    getPatients,
    editPatient,
    deletePatient,
    addWellnessContent,
    deleteWellnessContent,
    getWellnessContent,
    getRecentPayments,
    getPsychiatristToPatientRatio,
    getWellnessContentByCategory
} = require('../controllers/adminController');


// Psychiatrist Routes
router.post('/psychiatrists', addNewPsychiatrist);                  // Add new psychiatrist
router.get('/psychiatrists', getPsychiatrists);                     // Get all psychiatrists
router.put('/psychiatrists/:id', editPsychiatrist);                 // Edit psychiatrist details
router.delete('/psychiatrists/:id', deletePsychiatrist);            // Delete psychiatrist

// Patient Routes
router.get('/patients', getPatients);                              // Get all patients (table view)
router.get('/patients/:id', getPatientById);                       // View full details of a patient
router.put('/patients/:id', editPatient);                          // Edit patient details
router.delete('/patients/:id',  deletePatient);                     // Delete patient by ID

// Wellness Content Routes
router.get('/wellness-content',  getWellnessContent);               // Get all wellness content
router.post('/wellness-content',  addWellnessContent);              // Add new wellness content
router.delete('/wellness-content/:id',  deleteWellnessContent);     // Delete wellness content by ID

// Dashboard Routes
router.get('/psychiatrist-to-patient-ratio', getPsychiatristToPatientRatio);  // Get psychiatrist to patient ratio
router.get('/wellness-content-by-category',  getWellnessContentByCategory);    // Get wellness content count by category
router.get('/recent-payments', getRecentPayments);                            // Get recent payments with payment proof

module.exports = router;
