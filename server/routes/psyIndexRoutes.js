const express = require('express');
const router = express.Router();
const psyindexController = require('../controllers/psyindexController');

        // Route to get Psychiatrist's full name based on psychiatrist_id in params
        router.get('/psychiatrist/name/:psychiatrist_id', psyindexController.getPsychiatristName);

        // Route to get the number of patients needing medication review
        router.get('/psychiatrist/med-review/:psychiatrist_id', psyindexController.getNumberPatientMedReview);

        // Route to get upcoming sessions for the psychiatrist
        router.get('/psychiatrist/upcoming-sessions/:psychiatrist_id', psyindexController.getUpcomingSession);

        // Route to get the total number of distinct patients
        router.get('/psychiatrist/total-patients/:psychiatrist_id', psyindexController.getTotalPatients);

        // Route to get the total number of completed appointments
        router.get('/psychiatrist/total-appointments/:psychiatrist_id', psyindexController.getTotalAppointments);

        // Route to get the total number of patients prescribed by the psychiatrist
        router.get('/psychiatrist/total-patients-prescribed/:psychiatrist_id', psyindexController.getTotalPatientsPrescribed);

        // Route to get the history of past appointments (completed and canceled)
        router.get('/psychiatrist/appointment-history/:psychiatrist_id', psyindexController.getHistoryOfAppointments);

        // Route to get the list of upcoming appointments
        router.get('/psychiatrist/upcoming-appointments/:psychiatrist_id', psyindexController.getUpcomingAppointments);

        // Route to get previous sessions and clinical notes for a selected patient
        router.get('/psychiatrist/view-details/:psychiatrist_id/:patientId', psyindexController.getViewDetails);

        // Route to post a new clinical note for a selected patient
        router.post('/psychiatrist/clinical-notes/:psychiatrist_id', psyindexController.postNewClinicalNotes);

        // Route to delete selected clinical notes
        router.delete('/psychiatrist/delete-notes/:psychiatrist_id', psyindexController.deleteSelectedNotes);

        // Route to delete a selected patient's appointments but keep clinical notes
        router.delete('/psychiatrist/delete-record/:psychiatrist_id/:patientId', psyindexController.deleteRecord);

        // Route to get a list of patients for prescription purposes
        router.get('/psychiatrist/patients-for-prescription/:psychiatrist_id', psyindexController.getPatientsForPrescription);

        // Route to post a new prescription for a selected patient
        router.post('/psychiatrist/prescription/:psychiatrist_id', psyindexController.postPrescription);

        // Route to get the prescription history for the psychiatrist
        router.get('/psychiatrist/prescription-history/:psychiatrist_id', psyindexController.getPrescriptionHistory);

        // Route to get a list of patients who booked sessions with the psychiatrist
        router.get('/psychiatrist/patient-list/:psychiatrist_id', psyindexController.getPatientList);

        // Route to get all clinical notes for editing for a selected patient
        router.get('/psychiatrist/clinical-notes/edit/:psychiatrist_id/:patientId', psyindexController.getAllClinicalNotesForEdit);

        // Route to save the edited clinical notes
        router.patch('/psychiatrist/clinical-notes/save/:psychiatrist_id/:noteId', psyindexController.saveEditedNotes);

        // Route to delete all clinical notes for a selected patient
        router.delete('/psychiatrist/clinical-notes/delete/:psychiatrist_id/:patientId', psyindexController.deleteAllClinicalNotes);

        // Route to get Psychiatrist Personal Details
        router.get('/psychiatrist/personal-details/:psychiatrist_id', psyindexController.getPersonalDetails);

        // Route to update Psychiatrist password
        router.patch('/psychiatrist/password/:psychiatrist_id', psyindexController.patchPassword);

        // Route to delete Psychiatrist account
        router.delete('/psychiatrist/account/:psychiatrist_id', psyindexController.deleteAccount);

module.exports = router;
