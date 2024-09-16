const express = require('express');
const router = express.Router();
const psyindexController = require('../controllers/psyindexController');
const checkPsychiatristRole = require('../controllers/psyindexController');

// Route to get Psychiatrist's full name based on the session
router.get('/psychiatrist/name', checkPsychiatristRole, psyindexController.getPsychiatristName);

// Route to get the number of patients needing medication review
router.get('/psychiatrist/med-review', checkPsychiatristRole, psyindexController.getNumberPatientMedReview);

// Route to get upcoming sessions for the logged-in psychiatrist
router.get('/psychiatrist/upcoming-sessions', checkPsychiatristRole, psyindexController.getUpcomingSession);

// Route to get the total number of distinct patients
router.get('/psychiatrist/total-patients', checkPsychiatristRole, psyindexController.getTotalPatients);

// Route to get the total number of completed appointments
router.get('/psychiatrist/total-appointments', checkPsychiatristRole, psyindexController.getTotalAppointments);

// Route to get the total number of patients prescribed by the psychiatrist
router.get('/psychiatrist/total-patients-prescribed', checkPsychiatristRole, psyindexController.getTotalPatientsPrescribed);

// Route to get the history of past appointments (completed and canceled)
router.get('/psychiatrist/appointment-history', checkPsychiatristRole, psyindexController.getHistoryOfAppointments);

// Route to get the list of upcoming appointments
router.get('/psychiatrist/upcoming-appointments', checkPsychiatristRole, psyindexController.getUpcomingAppointments);

// Route to get previous sessions and clinical notes for a selected patient
router.get('/psychiatrist/view-details/:patientId', checkPsychiatristRole, psyindexController.getViewDetails);

// Route to post a new clinical note for a selected patient
router.post('/psychiatrist/clinical-notes', checkPsychiatristRole, psyindexController.postNewClinicalNotes);

// Route to delete selected clinical notes
router.delete('/psychiatrist/delete-notes', checkPsychiatristRole, psyindexController.deleteSelectedNotes);

// Route to delete a selected patient's appointments but keep clinical notes
router.delete('/psychiatrist/delete-record/:patientId', checkPsychiatristRole, psyindexController.deleteRecord);

// Route to get a list of patients for prescription purposes
router.get('/psychiatrist/patients-for-prescription', checkPsychiatristRole, psyindexController.getPatientsForPrescription);

// Route to post a new prescription for a selected patient
router.post('/psychiatrist/prescription', checkPsychiatristRole, psyindexController.postPrescription);

// Route to get the prescription history for the psychiatrist
router.get('/psychiatrist/prescription-history', checkPsychiatristRole, psyindexController.getPrescriptionHistory);

// Route to get a list of patients who booked sessions with the psychiatrist
router.get('/psychiatrist/patient-list', checkPsychiatristRole, psyindexController.getPatientList);

// Route to get all clinical notes for editing for a selected patient
router.get('/psychiatrist/clinical-notes/edit/:patientId', checkPsychiatristRole, psyindexController.getAllClinicalNotesForEdit);

// Route to save the edited clinical notes
router.patch('/psychiatrist/clinical-notes/save/:noteId', checkPsychiatristRole, psyindexController.saveEditedNotes);

// Route to delete all clinical notes for a selected patient
router.delete('/psychiatrist/clinical-notes/delete/:patientId', checkPsychiatristRole, psyindexController.deleteAllClinicalNotes);

// Route to get Psychiatrist Personal Details
router.get('/psychiatrist/personal-details', checkPsychiatristRole, psyindexController.getPersonalDetails);

// Route to update Psychiatrist password
router.patch('/psychiatrist/password', checkPsychiatristRole, psyindexController.patchPassword);

// Route to delete Psychiatrist account
router.delete('/psychiatrist/account', checkPsychiatristRole, psyindexController.deleteAccount);

module.exports = router;
