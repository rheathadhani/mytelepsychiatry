const db = require('../db');

const checkAdminRole = (req, res) => {
    if (!req.session.userRole || req.session.userRole !== 'admin') {
        return res.status(403).json({ message: 'Access denied. This resource is only accessible to admins.' });
    }
};

//Psychiatrist Controller Functions

// Add a new psychiatrist
const addNewPsychiatrist = (req, res) => {
    checkAdminRole(req, res);
    
    const { fullName, email, password, specialization } = req.body;
    const createdAt = new Date(); // Record the current date and time

    const query = `
        INSERT INTO Psychiatrists (full_name, email, password, specialization, created_at)
        VALUES (?, ?, ?, ?, ?);
    `;

    db.query(query, [fullName, email, password, specialization, createdAt], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error adding psychiatrist', error: err });
        }
        res.status(201).json({ message: 'Psychiatrist added successfully', psychiatristId: result.insertId });
    });
};

// Get all psychiatrists
const getPsychiatrists = (req, res) => {
    checkAdminRole(req, res);

    const query = `
        SELECT psychiatrist_id, full_name, email, password, specialization, created_at 
        FROM Psychiatrists;
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching psychiatrists', error: err });
        }
        res.status(200).json(results);
    });
};

// Edit psychiatrist details
const editPsychiatrist = (req, res) => {
    checkAdminRole(req, res);

    const psychiatristId = req.params.id;
    const { fullName, email, password, specialization } = req.body;

    const query = `
        UPDATE Psychiatrists 
        SET full_name = ?, email = ?, password = ?, specialization = ? 
        WHERE psychiatrist_id = ?;
    `;

    db.query(query, [fullName, email, password, specialization, psychiatristId], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating psychiatrist details', error: err });
        }
        res.status(200).json({ message: 'Psychiatrist details updated successfully' });
    });
};

// Delete a psychiatrist
const deletePsychiatrist = (req, res) => {
    checkAdminRole(req, res);

    const psychiatristId = req.params.id;

    const query = `
        DELETE FROM Psychiatrists 
        WHERE psychiatrist_id = ?;
    `;

    db.query(query, [psychiatristId], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting psychiatrist', error: err });
        }
        res.status(200).json({ message: 'Psychiatrist deleted successfully' });
    });
};

//Patient Controller Functions

// Get all patients for table view (limited fields)
const getPatients = (req, res) => {
    checkAdminRole(req, res);

    const query = `
        SELECT p.patient_id, p.full_name, u.email, p.date_of_birth, p.emergency_contact_name, p.emergency_contact_no
        FROM Patients p
        JOIN Users u ON p.user_id = u.user_id;
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching patients', error: err });
        }
        res.status(200).json(results);
    });
};

// View full details of a patient
const getPatientById = (req, res) => {
    checkAdminRole(req, res);

    const patientId = req.params.id;
    const query = `
        SELECT p.patient_id, p.full_name, u.email, p.date_of_birth, p.address, 
               p.emergency_contact_name, p.emergency_contact_no, u.created_at
        FROM Patients p
        JOIN Users u ON p.user_id = u.user_id
        WHERE p.patient_id = ?;
    `;

    db.query(query, [patientId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching patient details', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.status(200).json(results[0]);
    });
};

// Edit specific fields of a patient (only editable fields)
const editPatient = (req, res) => {
    checkAdminRole(req, res);

    const patientId = req.params.id;
    const { fullName, dateOfBirth, emergencyContactName, contactNumber } = req.body;

    const query = `
        UPDATE Patients 
        SET full_name = ?, date_of_birth = ?, emergency_contact_name = ?, emergency_contact_no = ? 
        WHERE patient_id = ?;
    `;

    db.query(query, [fullName, dateOfBirth, emergencyContactName, contactNumber, patientId], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating patient details', error: err });
        }
        res.status(200).json({ message: 'Patient details updated successfully' });
    });
};

// Delete a patient by ID
const deletePatient = (req, res) => {
    checkAdminRole(req, res);

    const patientId = req.params.id;

    const query = `
        DELETE FROM Patients
        WHERE patient_id = ?;
    `;

    db.query(query, [patientId], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting patient', error: err });
        }
        res.status(200).json({ message: 'Patient deleted successfully' });
    });
};

//Wellness Content Controller Functions

// Get all wellness content
const getWellnessContent = (req, res) => {
    checkAdminRole(req, res);

    const query = `
        SELECT contentID, image_link, content_category, description, video_link
        FROM WellnessContent;
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching wellness content', error: err });
        }
        res.status(200).json(results);
    });
};

// Delete wellness content by ID
const deleteWellnessContent = (req, res) => {
    checkAdminRole(req, res);

    const contentID = req.params.id;

    const query = `
        DELETE FROM WellnessContent
        WHERE contentID = ?;
    `;

    db.query(query, [contentID], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting wellness content', error: err });
        }
        res.status(200).json({ message: 'Wellness content deleted successfully' });
    });
};

// Add new wellness content
const addWellnessContent = (req, res) => {
    checkAdminRole(req, res);

    const { imageLink, contentCategory, description, videoLink } = req.body;

    const query = `
        INSERT INTO WellnessContent (image_link, content_category, description, video_link)
        VALUES (?, ?, ?, ?);
    `;

    db.query(query, [imageLink, contentCategory, description, videoLink], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error adding wellness content', error: err });
        }
        res.status(201).json({ message: 'Wellness content added successfully', contentID: result.insertId });
    });
};

// Get Psychiatrist to Patient Ratio
const getPsychiatristToPatientRatio = (req, res) => {
    checkAdminRole(req, res);

    const queryPsychiatrists = `SELECT COUNT(*) AS psychiatristCount FROM Psychiatrists;`;
    const queryPatients = `SELECT COUNT(*) AS patientCount FROM Patients;`;

    db.query(queryPsychiatrists, (err, psychiatristResults) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching psychiatrist count', error: err });
        }

        db.query(queryPatients, (err, patientResults) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching patient count', error: err });
            }

            res.status(200).json({
                psychiatristCount: psychiatristResults[0].psychiatristCount,
                patientCount: patientResults[0].patientCount
            });
        });
    });
};

//Dashboard Controller Functions

// Get Wellness Content Count by Category
const getWellnessContentByCategory = (req, res) => {
    checkAdminRole(req, res);

    const query = `
        SELECT content_category, COUNT(*) AS total
        FROM WellnessContent
        GROUP BY content_category;
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching wellness content by category', error: err });
        }
        res.status(200).json(results);
    });
};

// Get Recent Payments with Payment Proof
const getRecentPayments = (req, res) => {
    checkAdminRole(req, res);

    const query = `
        SELECT p.payment_date AS date, p.payment_amount AS amount, 
               pt.full_name AS patient, psy.full_name AS psychiatrist
        FROM Payments p
        JOIN Patients pt ON p.patient_id = pt.patient_id
        JOIN Appointments a ON p.appointment_id = a.appointment_id
        JOIN Psychiatrists psy ON a.psychiatrist_id = psy.psychiatrist_id
        WHERE p.payment_proof IS NOT NULL
        ORDER BY p.payment_date DESC
        LIMIT 5;
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching recent payments', error: err });
        }
        res.status(200).json(results);
    });
};



module.exports = {
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
    getWellnessContentByCategory,
};
