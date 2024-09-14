const db = require('../db');

// Check if user is a psychiatrist
const checkPsychiatristRole = (req, res) => {
    if (!req.session.userRole || req.session.userRole !== 'psychiatrist') {
        return res.status(403).json({ message: 'Access denied. This resource is only accessible to psychiatrists.' });
    }
};

// Get Psychiatrist's Full Name based on session
const getPsychiatristName = (req, res) => {
    // Call the checkPsychiatristRole function
    checkPsychiatristRole(req, res);

    const psychiatristId = req.session.userId; // Retrieve psychiatrist's user ID from session

    if (!psychiatristId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const query = `
        SELECT full_name 
        FROM Psychiatrists 
        WHERE user_id = ?;
    `;

    db.query(query, [psychiatristId], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            return res.status(404).send('Psychiatrist not found.');
        }

        res.status(200).json({ psychiatristName: results[0].full_name });
    });
};

// Get the number of patients needing medication review
const getNumberPatientMedReview = (req, res) => {
    // Call checkPsychiatristRole to ensure access control
    checkPsychiatristRole(req, res);

    const psychiatristId = req.session.userId; // Get psychiatrist's user ID from the session

    if (!psychiatristId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    // Query to get all completed appointments for the psychiatrist within the last 24 hours
    const completedAppointmentsQuery = `
        SELECT appointment_id, patient_id
        FROM Appointments
        WHERE psychiatrist_id = ?
        AND status = 'completed'
        AND appointment_date >= NOW() - INTERVAL 1 DAY;
    `;

    db.query(completedAppointmentsQuery, [psychiatristId], (err, appointments) => {
        if (err) {
            console.error('Error querying appointments:', err);
            return res.status(500).send('Server error');
        }

        if (appointments.length === 0) {
            return res.status(200).json({ message: 'No appointments to review.', reviewCount: 0 });
        }

        const appointmentIds = appointments.map(app => app.appointment_id);

        // Query to check if these completed appointments have any prescriptions
        const prescriptionCheckQuery = `
            SELECT appointment_id
            FROM Prescriptions
            WHERE appointment_id IN (?);
        `;

        db.query(prescriptionCheckQuery, [appointmentIds], (err, prescriptions) => {
            if (err) {
                console.error('Error querying prescriptions:', err);
                return res.status(500).send('Server error');
            }

            // Find appointments without prescriptions
            const prescribedAppointmentIds = prescriptions.map(pres => pres.appointment_id);
            const reviewNeededAppointments = appointments.filter(app => !prescribedAppointmentIds.includes(app.appointment_id));

            // Return the count of patients needing a medication review
            res.status(200).json({ message: 'Medication review count', reviewCount: reviewNeededAppointments.length });
        });
    });
};


// Get upcoming sessions for the logged-in psychiatrist
const getUpcomingSession = (req, res) => {
    // Call checkPsychiatristRole to ensure access control
    checkPsychiatristRole(req, res);

    const psychiatristId = req.session.userId; // Get psychiatrist's user ID from the session

    if (!psychiatristId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    // Query to get upcoming appointments for the psychiatrist
    const upcomingAppointmentsQuery = `
        SELECT p.full_name, a.appointment_date, a.meeting_link
        FROM Appointments a
        INNER JOIN Patients p ON a.patient_id = p.patient_id
        WHERE a.psychiatrist_id = ?
        AND a.appointment_date > NOW()
        ORDER BY a.appointment_date ASC;
    `;

    db.query(upcomingAppointmentsQuery, [psychiatristId], (err, results) => {
        if (err) {
            console.error('Error querying upcoming sessions:', err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            return res.status(200).json({ message: 'No upcoming sessions.', sessions: [] });
        }

        // Return the list of upcoming sessions with patient name, appointment date, and meeting link
        res.status(200).json({
            message: 'Upcoming sessions',
            sessions: results.map(session => ({
                patientName: session.full_name,
                appointmentDate: session.appointment_date,
                meetingLink: session.meeting_link
            }))
        });
    });
};



// Get the total number of distinct patients with at least one completed appointment
const getTotalPatients = (req, res) => {
    // Call checkPsychiatristRole to ensure access control
    checkPsychiatristRole(req, res);

    const psychiatristId = req.session.userId; // Get psychiatrist's user ID from the session

    if (!psychiatristId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    // Query to get the total number of distinct patients with completed appointments
    const totalPatientsQuery = `
        SELECT COUNT(DISTINCT patient_id) AS totalPatients
        FROM Appointments
        WHERE psychiatrist_id = ?
        AND status = 'completed';
    `;

    db.query(totalPatientsQuery, [psychiatristId], (err, results) => {
        if (err) {
            console.error('Error querying total patients:', err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            return res.status(200).json({ totalPatients: 0 });
        }

        // Return the total number of distinct patients
        res.status(200).json({
            message: 'Total patients with completed appointments',
            totalPatients: results[0].totalPatients
        });
    });
};


// Get the total number of completed appointments for the logged-in psychiatrist
const getTotalAppointments = (req, res) => {
    // Call checkPsychiatristRole to ensure access control
    checkPsychiatristRole(req, res);

    const psychiatristId = req.session.userId; // Get psychiatrist's user ID from the session

    if (!psychiatristId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    // Query to get the total number of completed appointments
    const totalAppointmentsQuery = `
        SELECT COUNT(*) AS totalAppointments
        FROM Appointments
        WHERE psychiatrist_id = ?
        AND status = 'completed';
    `;

    db.query(totalAppointmentsQuery, [psychiatristId], (err, results) => {
        if (err) {
            console.error('Error querying total appointments:', err);
            return res.status(500).send('Server error');
        }

        // Return the total number of completed appointments
        res.status(200).json({
            message: 'Total completed appointments',
            totalAppointments: results[0].totalAppointments
        });
    });
};



// Get the total number of patients prescribed by the logged-in psychiatrist
const getTotalPatientsPrescribed = (req, res) => {
    // Call checkPsychiatristRole to ensure access control
    checkPsychiatristRole(req, res);

    const psychiatristId = req.session.userId; // Get psychiatrist's user ID from the session

    if (!psychiatristId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    // Query to get the total number of distinct patients who have been prescribed medicines by the psychiatrist
    const totalPatientsPrescribedQuery = `
        SELECT COUNT(DISTINCT patient_id) AS totalPatientsPrescribed
        FROM Prescriptions
        WHERE psychiatrist_id = ?;
    `;

    db.query(totalPatientsPrescribedQuery, [psychiatristId], (err, results) => {
        if (err) {
            console.error('Error querying total prescribed patients:', err);
            return res.status(500).send('Server error');
        }

        // Return the total number of patients who have been prescribed medicines
        res.status(200).json({
            message: 'Total patients prescribed medicines',
            totalPatientsPrescribed: results[0].totalPatientsPrescribed
        });
    });
};



// Get the history of past appointments (completed and canceled) for the logged-in psychiatrist
const getHistoryOfAppointments = (req, res) => {
    // Call checkPsychiatristRole to ensure access control
    checkPsychiatristRole(req, res);

    const psychiatristId = req.session.userId; // Get psychiatrist's user ID from the session

    if (!psychiatristId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    // Query to get the past appointments with status 'completed' or 'cancelled'
    const pastAppointmentsQuery = `
        SELECT a.appointment_date, a.status, p.full_name
        FROM Appointments a
        INNER JOIN Patients p ON a.patient_id = p.patient_id
        WHERE a.psychiatrist_id = ?
        AND a.status IN ('completed', 'cancelled')
        ORDER BY a.appointment_date DESC;
    `;

    db.query(pastAppointmentsQuery, [psychiatristId], (err, results) => {
        if (err) {
            console.error('Error querying past appointments:', err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            return res.status(200).json({ message: 'No past appointments found.', appointments: [] });
        }

        // Return the list of past appointments with patient name, date, time, and status
        res.status(200).json({
            message: 'History of past appointments',
            appointments: results.map(appointment => ({
                patientName: appointment.full_name,
                appointmentDate: appointment.appointment_date,
                status: appointment.status
            }))
        });
    });
};


// Get the list of upcoming appointments for the logged-in psychiatrist
const getUpcomingAppointments = (req, res) => {
    // Call checkPsychiatristRole to ensure access control
    checkPsychiatristRole(req, res);

    const psychiatristId = req.session.userId; // Get psychiatrist's user ID from the session

    if (!psychiatristId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    // Query to get the upcoming appointments and related details
    const upcomingAppointmentsQuery = `
        SELECT p.full_name, a.appointment_date, a.status AS booking_status, 
               pa.payment_status
        FROM Appointments a
        INNER JOIN Patients p ON a.patient_id = p.patient_id
        LEFT JOIN Payments pa ON a.appointment_id = pa.appointment_id
        WHERE a.psychiatrist_id = ?
        AND a.status IN ('confirmed', 'pending', 'ongoing', 'rescheduled')
        AND a.appointment_date > NOW()
        ORDER BY a.appointment_date ASC;
    `;

    db.query(upcomingAppointmentsQuery, [psychiatristId], (err, results) => {
        if (err) {
            console.error('Error querying upcoming appointments:', err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            return res.status(200).json({ message: 'No upcoming appointments found.', appointments: [] });
        }

        // Return the list of upcoming appointments with patient name, appointment date, payment status, and booking status
        res.status(200).json({
            message: 'Upcoming appointments',
            appointments: results.map(appointment => ({
                patientName: appointment.full_name,
                appointmentDate: appointment.appointment_date,
                bookingStatus: appointment.booking_status,
                paymentStatus: appointment.payment_status || 'pending'
            }))
        });
    });
};


// Get the details of previous sessions and clinical notes for a selected patient
const getViewDetails = (req, res) => {
    // Call checkPsychiatristRole to ensure access control
    checkPsychiatristRole(req, res);

    const psychiatristId = req.session.userId; // Get psychiatrist's user ID from the session
    const patientId = req.params.patientId; // Get patient ID from request parameters

    if (!psychiatristId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    // Query to get previous session details for the patient (completed appointments)
    const previousSessionsQuery = `
        SELECT a.appointment_date, a.meeting_link, a.status
        FROM Appointments a
        WHERE a.psychiatrist_id = ? 
        AND a.patient_id = ? 
        AND a.status = 'completed'
        ORDER BY a.appointment_date DESC;
    `;

    db.query(previousSessionsQuery, [psychiatristId, patientId], (err, sessions) => {
        if (err) {
            console.error('Error querying previous sessions:', err);
            return res.status(500).send('Server error');
        }

        if (sessions.length === 0) {
            return res.status(200).json({ message: 'No previous sessions found for this patient.', sessions: [] });
        }

        // Query to get clinical notes for the patient
        const clinicalNotesQuery = `
            SELECT note_text, note_date
            FROM ClinicalNotes
            WHERE psychiatrist_id = ? 
            AND patient_id = ?
            ORDER BY note_date DESC;
        `;

        db.query(clinicalNotesQuery, [psychiatristId, patientId], (err, notes) => {
            if (err) {
                console.error('Error querying clinical notes:', err);
                return res.status(500).send('Server error');
            }

            // Return the session details and clinical notes
            res.status(200).json({
                message: 'Patient session details and clinical notes',
                sessions: sessions.map(session => ({
                    appointmentDate: session.appointment_date,
                    meetingLink: session.meeting_link,
                    status: session.status
                })),
                clinicalNotes: notes.map(note => ({
                    noteText: note.note_text,
                    noteDate: note.note_date
                }))
            });
        });
    });
};


// Post a new clinical note for the selected patient
const postNewClinicalNotes = (req, res) => {
    // Call checkPsychiatristRole to ensure access control
    checkPsychiatristRole(req, res);

    const psychiatristId = req.session.userId; // Get psychiatrist's user ID from the session
    const { patientId, noteText } = req.body; // Get patient ID and note text from the request body

    if (!psychiatristId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    if (!patientId || !noteText) {
        return res.status(400).json({ message: 'Patient ID and note text are required.' });
    }

    // Query to insert a new clinical note for the patient
    const insertNoteQuery = `
        INSERT INTO ClinicalNotes (patient_id, psychiatrist_id, note_text, note_date)
        VALUES (?, ?, ?, NOW());
    `;

    db.query(insertNoteQuery, [patientId, psychiatristId, noteText], (err, result) => {
        if (err) {
            console.error('Error inserting clinical note:', err);
            return res.status(500).send('Server error');
        }

        // Respond with success message
        res.status(201).json({
            message: 'Clinical note added successfully',
            noteId: result.insertId // Return the ID of the inserted note for reference
        });
    });
};


// Delete selected clinical notes for the logged-in psychiatrist
const deleteSelectedNotes = (req, res) => {
    // Call checkPsychiatristRole to ensure access control
    checkPsychiatristRole(req, res);

    const psychiatristId = req.session.userId; // Get psychiatrist's user ID from the session
    const { noteIds } = req.body; // Get the selected note IDs from the request body

    if (!psychiatristId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    if (!noteIds || noteIds.length === 0) {
        return res.status(400).json({ message: 'No notes selected for deletion.' });
    }

    // Query to delete the selected clinical notes
    const deleteNotesQuery = `
        DELETE FROM ClinicalNotes 
        WHERE note_id IN (?) 
        AND psychiatrist_id = ?;
    `;

    db.query(deleteNotesQuery, [noteIds, psychiatristId], (err, result) => {
        if (err) {
            console.error('Error deleting clinical notes:', err);
            return res.status(500).send('Server error');
        }

        // Respond with success message
        res.status(200).json({
            message: 'Selected clinical notes deleted successfully',
            deletedCount: result.affectedRows // Return the number of rows deleted
        });
    });
};


// Delete the selected patient's appointments but keep the clinical notes and other patient data
const deleteRecord = (req, res) => {
    // Call checkPsychiatristRole to ensure access control
    checkPsychiatristRole(req, res);

    const psychiatristId = req.session.userId; // Get psychiatrist's user ID from the session
    const { patientId } = req.params; // Get patient ID from the request parameters

    if (!psychiatristId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    if (!patientId) {
        return res.status(400).json({ message: 'Patient ID is required.' });
    }

    // Start a transaction to ensure appointments are deleted but clinical notes remain intact
    db.beginTransaction(err => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).send('Server error');
        }

        // Step 1: Delete appointments associated with the patient
        const deleteAppointmentsQuery = `
            DELETE FROM Appointments 
            WHERE patient_id = ?;
        `;
        db.query(deleteAppointmentsQuery, [patientId], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Error deleting appointments:', err);
                    res.status(500).send('Server error');
                });
            }

            // Commit the transaction after appointments are deleted successfully
            db.commit(err => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Error committing transaction:', err);
                        res.status(500).send('Server error');
                    });
                }

                // Success response
                res.status(200).json({
                    message: 'Patient appointments deleted successfully, clinical notes preserved.'
                });
            });
        });
    });
};





module.exports = {
    getPsychiatristName,
    getNumberPatientMedReview,
    getUpcomingSession,
    getTotalPatients,
    getTotalAppointments,
    getTotalPatientsPrescribed,
    getHistoryOfAppointments,
    getUpcomingAppointments,
    getViewDetails,
    postNewClinicalNotes,
    deleteSelectedNotes,
    deleteRecord,


}