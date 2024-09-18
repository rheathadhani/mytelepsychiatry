const express = require('express');
const router = express.Router();
const psyindexController = require('../controllers/psyindexController');

// Dashboard Routes

// Route to get Psychiatrist's full name
router.get('/psychiatrist/name/:psychiatrist_id', psyindexController.getPsychiatristName);

// Route to get upcoming sessions for the psychiatrist
router.get('/psychiatrist/upcoming-sessions/:psychiatrist_id', psyindexController.getUpcomingSession);

// Route to get total distinct patients with completed appointments
router.get('/psychiatrist/total-patients/:psychiatrist_id', psyindexController.getTotalPatients);

// Route to get total completed appointments
router.get('/psychiatrist/total-appointments/:psychiatrist_id', psyindexController.getTotalAppointments);

// Route to get total patients prescribed medicines
router.get('/psychiatrist/total-patients-prescribed/:psychiatrist_id', psyindexController.getTotalPatientsPrescribed);

// Route to get the history of past appointments (completed and canceled)
router.get('/psychiatrist/appointment-history/:psychiatrist_id', psyindexController.getHistoryOfAppointments);

// Patient Appointments Routes

// Route to get upcoming appointments for the psychiatrist
router.get('/psychiatrist/upcoming-appointments/:psychiatrist_id', psyindexController.getUpcomingAppointments);

// Route to get previous sessions and clinical notes for a selected patient
router.get('/psychiatrist/view-details/:psychiatrist_id/:patientId', psyindexController.getViewDetails);

// Route to post a new clinical note for a selected patient
router.post('/psychiatrist/clinical-notes/:psychiatrist_id', psyindexController.postNewClinicalNotes);

// Route to delete selected clinical notes
router.delete('/psychiatrist/delete-notes/:psychiatrist_id', psyindexController.deleteSelectedNotes);

// Route to delete selected patient's appointments but keep the clinical notes
router.delete('/psychiatrist/delete-record/:psychiatrist_id/:patientId', psyindexController.deleteRecord);

// Prescribed Patient Medication Routes

// Route to get list of patients for prescription purposes
router.get('/psychiatrist/:psychiatristId/patients-for-prescription', psyindexController.getPatientsForPrescription);

// Route to post a new prescription for a selected patient
router.post('/psychiatrist/prescription/:psychiatrist_id', psyindexController.postPrescription);

// Route to get the prescription history for the psychiatrist
router.get('/psychiatrist/prescription-history/:psychiatrist_id', psyindexController.getPrescriptionHistory);

// Clinical Notes Routes

// Route to get list of patients for clinical notes
router.get('/psychiatrist/patient-list/:psychiatrist_id', psyindexController.getPatientList);

// Route to post clinical notes for a selected patient
router.post('/psychiatrist/clinical-notes/:psychiatrist_id', psyindexController.postClinicalNotes);

// Route to get all clinical notes for editing for a selected patient
router.get('/psychiatrist/clinical-notes/edit/:psychiatrist_id/:patientId', psyindexController.getAllClinicalNotesForEdit);

// Route to save edited clinical notes
router.patch('/psychiatrist/clinical-notes/save/:psychiatrist_id/:noteId', psyindexController.saveEditedNotes);

// Route to delete all clinical notes for a selected patient
router.delete('/psychiatrist/clinical-notes/delete/:psychiatrist_id/:patientId', psyindexController.deleteAllClinicalNotes);

// Psychiatrist Profile Routes

// Route to get psychiatrist personal details
router.get('/psychiatrist/personal-details/:psychiatrist_id', psyindexController.getPersonalDetails);

// Route to update psychiatrist password
router.patch('/psychiatrist/password/:psychiatrist_id', psyindexController.patchPassword);

// Route to delete psychiatrist account
router.delete('/psychiatrist/account/:psychiatrist_id', psyindexController.deleteAccount);

module.exports = router;
