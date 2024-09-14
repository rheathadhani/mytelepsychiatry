const db = require('../db');
const multer = require('multer');
const path = require('path');

// Check if user is a patient
const checkPatientRole = (req, res) => {
    if (!req.session.userRole || req.session.userRole !== 'patient') {
        return res.status(403).json({ message: 'Access denied. This resource is only accessible to patients.' });
    }
};

// Get Patient's Full Name based on session
const getPatientName = (req, res) => {
    checkPatientRole(req, res);

    const patientId = req.session.patientId; // Retrieve patientId from session

    if (!patientId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const query = `
        SELECT full_name 
        FROM Patients 
        WHERE patient_id = ?;
    `;
    
    db.query(query, [patientId], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (results.length === 0) {
            return res.status(404).send('Patient not found.');
        }

        res.status(200).json(results[0].full_name);
    });
};

// Get Upcoming Sessions based on session
const getUpcomingSessions = (req, res) => {
    checkPatientRole(req, res);

    const patientId = req.session.patientId; // Retrieve patientId from session

    if (!patientId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const query = `
        SELECT 
            a.appointment_date,
            p.full_name AS psychiatrist_name
        FROM 
            Appointments a
        JOIN 
            Psychiatrists p ON a.psychiatrist_id = p.psychiatrist_id
        WHERE 
            a.patient_id = ? AND a.appointment_date > NOW()
        ORDER BY 
            a.appointment_date ASC;
    `;
    
    db.query(query, [patientId], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(results);
    });
};

// Get Medications List based on session
const getMedicationsList = (req, res) => {
    checkPatientRole(req, res);

    const patientId = req.session.patientId; // Retrieve patientId from session

    if (!patientId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const query = `
        SELECT 
            medicine_name,
            dosage,
            frequency_per_day,
            duration_in_days,
            prescribed_date
        FROM 
            Prescriptions
        WHERE 
            patient_id = ?;
    `;
    
    db.query(query, [patientId], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(results);
    });
};

// Get Past Appointments based on session
const getPastAppointments = (req, res) => {
    checkPatientRole(req, res);

    const patientId = req.session.patientId; // Retrieve patientId from session

    if (!patientId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const query = `
        SELECT 
            a.appointment_date,
            p.full_name AS psychiatrist_name,
            a.status
        FROM 
            Appointments a
        JOIN 
            Psychiatrists p ON a.psychiatrist_id = p.psychiatrist_id
        WHERE 
            a.patient_id = ? AND a.appointment_date < NOW()
        ORDER BY 
            a.appointment_date DESC;
    `;
    
    db.query(query, [patientId], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(results);
    });
};

// Get available psychiatrists based on selected date and time
const getAvailablePsychiatrists = (req, res) => {
    const { selectedDateTime } = req.body;  // The selected date and time sent from the frontend

    // Add 1 hour to the selected time to account for the session length
    const selectedEndTime = new Date(selectedDateTime);
    selectedEndTime.setHours(selectedEndTime.getHours() + 1);

    const query = `
        SELECT 
            p.psychiatrist_id,
            p.full_name AS psychiatrist_name,
            p.specialization,
            p.image_url AS psychiatrist_image
        FROM 
            Psychiatrists p
        WHERE 
            p.psychiatrist_id NOT IN (
                SELECT a.psychiatrist_id 
                FROM Appointments a 
                WHERE 
                    (a.appointment_date >= ? AND a.appointment_date < ?)  -- Checks overlap of time slot
                    OR 
                    (a.appointment_date < ? AND a.appointment_end_time > ?)
            );
    `;

    db.query(query, [selectedDateTime, selectedEndTime, selectedDateTime, selectedEndTime], (err, results) => {
        if (err) {
            console.error('Error fetching available psychiatrists:', err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No available psychiatrists for the selected time.' });
        }

        res.status(200).json(results);
    });
};

// Get the profile of a selected psychiatrist
const getPsychiatristProfile = (req, res) => {
    const psychiatristId = req.params.psychiatristId;  // The selected psychiatrist's ID

    const query = `
        SELECT 
            full_name AS psychiatrist_name,
            specialization,
            image_url AS psychiatrist_image,
            'RM50' AS payment -- Static payment value
        FROM 
            Psychiatrists
        WHERE 
            psychiatrist_id = ?;
    `;

    db.query(query, [psychiatristId], (err, results) => {
        if (err) {
            console.error('Error fetching psychiatrist profile:', err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Psychiatrist not found.' });
        }

        res.status(200).json(results[0]);
    });
};

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'server/uploads/'); // Directory to store uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "payment " + path.extname(file.originalname)); // Appending file extension
    }
});

const upload = multer({ storage: storage });

// Get Appointment Details for Review and Payment Page
const getAppointmentDetails = (req, res) => {
    const appointmentId = req.params.appointmentId;  // Get appointmentId from URL parameters

    const query = `
        SELECT 
            p.full_name AS patient_name,
            psy.full_name AS psychiatrist_name,
            a.appointment_date,
            'RM50' AS payment_amount -- Static payment amount
        FROM 
            Appointments a
        JOIN 
            Patients p ON a.patient_id = p.patient_id
        JOIN 
            Psychiatrists psy ON a.psychiatrist_id = psy.psychiatrist_id
        WHERE 
            a.appointment_id = ?;
    `;

    db.query(query, [appointmentId], (err, results) => {
        if (err) {
            console.error('Error fetching appointment details:', err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        // Send the fetched appointment details to the frontend
        res.status(200).json(results[0]);
    });
};

// Post Payment Details and Save Payment Proof
const postPaymentDetails = (req, res) => {
    const { patientId, appointmentId, paymentMethod } = req.body; // Get patientId, appointmentId, and paymentMethod from the request
    const paymentProof = req.file ? req.file.filename : null; // Check if the file exists

    // Insert the payment record into the Payments table
    const query = `
        INSERT INTO Payments (patient_id, appointment_id, payment_method, payment_proof)
        VALUES (?, ?, ?, ?);
    `;

    db.query(query, [patientId, appointmentId, paymentMethod, paymentProof], (err, result) => {
        if (err) {
            console.error('Error saving payment details:', err);
            return res.status(500).send('Server error');
        }

        res.status(201).json({ message: 'Payment details saved successfully.' });
    });
};

// Get Payment Details for Review (Before submitting payment)
const getPaymentDetails = (req, res) => {
    const appointmentId = req.params.appointmentId;

    const query = `
        SELECT 
            p.full_name AS patient_name,
            psy.full_name AS psychiatrist_name,
            a.appointment_date,
            'RM50' AS payment_amount
        FROM 
            Appointments a
        JOIN 
            Patients p ON a.patient_id = p.patient_id
        JOIN 
            Psychiatrists psy ON a.psychiatrist_id = psy.psychiatrist_id
        WHERE 
            a.appointment_id = ?;
    `;

    db.query(query, [appointmentId], (err, results) => {
        if (err) {
            console.error('Error fetching payment details:', err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        res.status(200).json(results[0]);
    });
};

// Track Symptoms based on session
const trackSymptoms = (req, res) => {
    checkPatientRole(req, res);

    const patientId = req.session.patientId; // Retrieve patientId from session

    if (!patientId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { dateLogged, symptomDetails } = req.body;
    const query = `
        INSERT INTO Symptoms (patient_id, date_logged, symptom_details)
        VALUES (?, ?, ?);
    `;
    
    db.query(query, [patientId, dateLogged, symptomDetails], (err, result) => {
        if (err) {
            console.error('Error inserting symptoms:', err);
            return res.status(500).send(err);
        }
        res.status(201).json({ message: 'Symptoms tracked successfully.' });
    });
};

// Get Symptoms History based on session
const getSymptomsHistory = (req, res) => {
    checkPatientRole(req, res);

    const patientId = req.session.patientId; // Retrieve patientId from session

    if (!patientId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const query = `
        SELECT date_logged, symptom_details
        FROM Symptoms
        WHERE patient_id = ?
        ORDER BY date_logged DESC;
    `;
    
    db.query(query, [patientId], (err, results) => {
        if (err) {
            console.error('Error fetching symptoms history:', err);
            return res.status(500).send(err);
        }
        res.status(200).json(results);
    });
};

module.exports = {
    getPatientName,
    getUpcomingSessions,
    getMedicationsList,
    getPastAppointments,
    getAvailablePsychiatrists,
    getPsychiatristProfile,
    getAppointmentDetails,
    postPaymentDetails,
    getPaymentDetails,
    upload,
    trackSymptoms,
    getSymptomsHistory
};
