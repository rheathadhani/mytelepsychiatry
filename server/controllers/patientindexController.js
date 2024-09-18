const db = require('../db');
const multer = require('multer');
const path = require('path');

//const httpContext = require('express-http-context');

/* // Check if user is a patient
const checkPatientRole = (req, res) => {
    if (!req.session.userRole || req.session.userRole !== 'patient') {
        return res.status(403).json({ message: 'Access denied. This resource is only accessible to patients.' });
    }
};
 */

const getPatientName = (req, res) => {
    const patientId = req.params.patientId;  // Get patientId from URL parameters

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

// Get Upcoming Sessions based on patientId from params
const getUpcomingSessions = (req, res) => {
    const patientId = req.params.patientId;  // Get patientId from URL parameters

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

const getMedicationsList = (req, res) => {
    const patientId = req.params.patientId;  // Get patientId from URL parameters

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

const getPastAppointments = (req, res) => {
    const patientId = req.params.patientId;  // Get patientId from URL parameters

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


//Appoinments Page

const getAvailablePsychiatrists = (req, res) => {
    const { selectedDateTime } = req.body;  // The selected date and time sent from the frontend

    // Add 1 hour to the selected time to account for the session length
    const selectedEndTime = new Date(selectedDateTime);
    selectedEndTime.setHours(selectedEndTime.getHours() + 1);

    const query = `
        SELECT 
            p.psychiatrist_id,
            p.full_name AS psychiatrist_name,
            p.specialization
        FROM 
            Psychiatrists p
        WHERE 
            p.psychiatrist_id NOT IN (
                SELECT a.psychiatrist_id 
                FROM Appointments a 
                WHERE 
                    (a.appointment_date >= ? AND a.appointment_date < ?)  -- Checks overlap of time slot
            );
    `;

    db.query(query, [selectedDateTime, selectedEndTime], (err, results) => {
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


const getPsychiatristProfile = (req, res) => {
    const psychiatristId = req.params.psychiatristId;  // The selected psychiatrist's ID

    const query = `
        SELECT 
            full_name AS psychiatrist_name,
            specialization
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
        cb(null, 'uploads/'); // Directory to store uploaded files
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
    const { patientId, appointmentDateTime, psychiatristId, paymentMethod } = req.body; // Getting all the relevant data
    const paymentProof = req.file ? req.file.filename : null; // Get the payment proof if uploaded

    console.log(req.body.paymentMethod);
    // Step 1: Insert the appointment record into the Appointments table
    const meetingLink = "www.meet.google.com/mytelepsychiatry-2024"; // Static meeting link
    const insertAppointmentQuery = `
        INSERT INTO Appointments (patient_id, psychiatrist_id, appointment_date, meeting_link, status)
        VALUES (?, ?, ?, ?, 'scheduled');
    `;

    db.query(insertAppointmentQuery, [patientId, psychiatristId, appointmentDateTime, meetingLink], (err, appointmentResult) => {
        if (err) {
            console.error('Error saving appointment details:', err);
            return res.status(500).send('Server error while saving appointment details.');
        }

        const appointmentId = appointmentResult.insertId; // Get the appointment ID after insertion

        // Step 2: Insert the payment record into the Payments table
        const insertPaymentQuery = `
            INSERT INTO Payments (patient_id, appointment_id, payment_method, payment_proof)
            VALUES (?, ?, ?, ?);
        `;

        db.query(insertPaymentQuery, [patientId, appointmentId, paymentMethod, paymentProof], (err, paymentResult) => {
            if (err) {
                console.error('Error saving payment details:', err);
                return res.status(500).send('Server error while saving payment details.');
            }

            res.status(201).json({ message: 'Appointment and payment details saved successfully.' });
        });
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

// Track Symptoms based on patientId from params
const trackSymptoms = (req, res) => {
    const patientId = req.params.patientId;  // Get patientId from URL parameters
    const { dateLogged, symptomDetails } = req.body;

    const query = `
        INSERT INTO Symptoms (patient_id, date_logged, symptom_details)
        VALUES (?, ?, ?);
    `;

    db.query(query, [patientId, dateLogged, symptomDetails], (err, result) => {
        if (err) {
            return res.status(500).send('Error tracking symptoms');
        }
        res.status(201).json({ message: 'Symptoms tracked successfully.' });
    });
};


//Get Symptoms History based on patientId from params
const getSymptomsHistory = (req, res) => {
    const patientId = req.params.patientId;  // Get patientId from URL parameters

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



// Get patient personal details
const getPersonalDetails = (req, res) => {
    const patientId = req.params.patientId; // Assuming userId is stored in session

    const query = `
        SELECT p.full_name, u.email, p.date_of_birth, p.address, p.gender, 
               p.emergency_contact_name, p.emergency_contact_no 
        FROM Patients p
        JOIN Users u ON p.user_id = u.user_id
        WHERE p.patient_id = ?;
    `;

    db.query(query, [patientId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching patient details', error: err });
        }

        //console.log(results);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.status(200).json(results[0]);
    });
};

const patchPersonalDetails = (req, res) => {
    const patientId = req.params.patientId; // Get the patient_id from the request parameters
    const { fullName, email, dateOfBirth, address, gender, emergencyContactName, emergencyPhoneNumber } = req.body;

    // First, retrieve the user_id associated with this patient_id
    const getUserQuery = `
        SELECT user_id 
        FROM Patients 
        WHERE patient_id = ?;
    `;

    db.query(getUserQuery, [patientId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching user_id', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const userId = results[0].user_id;

        // Now update the Users table with the correct user_id
        const queryUsers = `
            UPDATE Users 
            SET email = ? 
            WHERE user_id = ?;
        `;

        db.query(queryUsers, [email, userId], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating user details', error: err });
            }

            // Then update the Patients table with the patient-specific details
            const queryPatients = `
                UPDATE Patients 
                SET full_name = ?, date_of_birth = ?, address = ?, gender = ?, 
                    emergency_contact_name = ?, emergency_contact_no = ? 
                WHERE patient_id = ?;
            `;

            db.query(queryPatients, [fullName, dateOfBirth, address, gender, emergencyContactName, emergencyPhoneNumber, patientId], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error updating patient details', error: err });
                }

                res.status(200).json({ message: 'Patient details updated successfully' });
            });
        });
    });
};

const patchPassword = (req, res) => {
    const patientId = req.params.patientId; // Getting the patient ID from the params
    const { newPassword } = req.body; // Assuming newPassword is passed in the request body

    // First, retrieve the user_id associated with the patientId
    const getUserQuery = `
        SELECT user_id 
        FROM Patients 
        WHERE patient_id = ?;
    `;

    db.query(getUserQuery, [patientId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching user ID', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const userId = results[0].user_id;

        // Now, update the password in the Users table using the retrieved user_id
        const query = `
            UPDATE Users 
            SET password = ? 
            WHERE user_id = ?;
        `;

        db.query(query, [newPassword, userId], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating password', error: err });
            }

            res.status(200).json({ message: 'Password updated successfully' });
        });
    });
};


// Delete patient account
const deleteAccount = (req, res) => {
    const patientId = req.params.patientId;  // Assuming userId is stored in session

    // Step 1: Delete from Patients table
    const deletePatientQuery = `
        DELETE FROM Patients WHERE user_id = ?;
    `;

    db.query(deletePatientQuery, [patientId], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting patient account', error: err });
        }

        // Step 2: Delete from Users table
        const deleteUserQuery = `
            DELETE FROM Users WHERE user_id = ?;
        `;

        db.query(deleteUserQuery, [patientId], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error deleting user account', error: err });
            }

            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error ending session after account deletion', error: err });
                }

                res.status(200).json({ message: 'Account deleted successfully' });
            });
        });
    });
};


const getPsychiatristsVisited = (req, res) => {
    const patientId = req.params.patientId;// Assuming userId is stored in session

    const query = `
        SELECT COUNT(DISTINCT psychiatrist_id) AS totalPsychiatristsVisited
        FROM Appointments
        WHERE patient_id = ?;
    `;

    db.query(query, [patientId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching psychiatrists visited', error: err });
        }
        res.status(200).json({ totalPsychiatristsVisited: results[0].totalPsychiatristsVisited });
    });
};


const getConsultation = (req, res) => {
    const patientId = req.params.patientId; // Assuming userId is stored in session

    const query = `
        SELECT COUNT(*) AS totalConsultations
        FROM Appointments
        WHERE patient_id = ?;
    `;

    db.query(query, [patientId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching consultations', error: err });
        }
        res.status(200).json({ totalConsultations: results[0].totalConsultations });
    });
};

const getTotalMedicationReceived = (req, res) => {
    const patientId = req.params.patientId; // Assuming userId is stored in session

    const query = `
        SELECT COUNT(*) AS totalMedicationsReceived
        FROM Prescriptions
        WHERE patient_id = ?;
    `;

    db.query(query, [patientId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching medications received', error: err });
        }
        res.status(200).json({ totalMedicationsReceived: results[0].totalMedicationsReceived });
    });
};

// Get Mindfulness Content
const getMindfulnessContent = (req, res) => {
    const query = `
        SELECT * FROM WellnessContent 
        WHERE content_category = 'mindfullness';
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching mindfulness content', error: err });
        }
        res.status(200).json(results);
    });
};

// Get Exercise Content
const getExerciseContent = (req, res) => {
    const query = `
        SELECT * FROM WellnessContent 
        WHERE content_category = 'exercise';
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching exercise content', error: err });
        }
        res.status(200).json(results);
    });
};

// Get Nutrition Content
const getNutritionContent = (req, res) => {
    const query = `
        SELECT * FROM WellnessContent 
        WHERE content_category = 'nutrition';
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching nutrition content', error: err });
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
    getSymptomsHistory,
    getPersonalDetails,
    patchPersonalDetails,
    patchPassword,
    deleteAccount,
    getPsychiatristsVisited,
    getConsultation,
    getTotalMedicationReceived,
    getMindfulnessContent,
    getExerciseContent,
    getNutritionContent
};