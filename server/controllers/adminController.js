const db = require('../db');

//Psychiatrist Controller Functions
const addNewPsychiatrist = (req, res) => {
    // Log incoming data
    console.log('Request body:', req.body);

    const { fullName, email, password, specialization } = req.body;
    const createdAt = new Date(); // Record the current date and time

    // First, insert into the Users table
    const userInsertQuery = `
        INSERT INTO Users (password, email, role, created_at)
        VALUES (?, ?, 'psychiatrist', ?);
    `;

    db.query(userInsertQuery, [password, email, createdAt], (err, userResult) => {
        if (err) {
            console.error('Error inserting user into Users table:', err);
            return res.status(500).json({ message: 'Error adding user to Users table', error: err });
        }

        // Get the inserted user's ID
        const userId = userResult.insertId;

        // Now, insert into the Psychiatrists table
        const psychiatristInsertQuery = `
            INSERT INTO Psychiatrists (user_id, full_name, specialization)
            VALUES (?, ?, ?);
        `;

        db.query(psychiatristInsertQuery, [userId, fullName, specialization], (err, psychiatristResult) => {
            if (err) {
                console.error('Error inserting psychiatrist into Psychiatrists table:', err);
                return res.status(500).json({ message: 'Error adding psychiatrist to Psychiatrists table', error: err });
            }

            res.status(201).json({ 
                message: 'Psychiatrist added successfully', 
                psychiatristId: psychiatristResult.insertId 
            });
        });
    });
};

const getPsychiatrists = (req, res) => {
    const query = `
        SELECT p.psychiatrist_id, p.full_name, u.email, u.password, p.specialization, u.created_at
        FROM Psychiatrists p
        JOIN Users u ON p.user_id = u.user_id;
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
    const psychiatristId = req.params.id;
    const { fullName, email, password, specialization } = req.body;

    // First, get the `user_id` associated with the psychiatrist
    const getUserIdQuery = `
        SELECT user_id FROM Psychiatrists WHERE psychiatrist_id = ?;
    `;

    db.query(getUserIdQuery, [psychiatristId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching user ID', error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Psychiatrist not found' });
        }

        const userId = result[0].user_id;

        // Update the Users table (for email and password)
        const updateUsersQuery = `
            UPDATE Users 
            SET email = ?, password = ? 
            WHERE user_id = ?;
        `;

        db.query(updateUsersQuery, [email, password, userId], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating user details', error: err });
            }

            // Update the Psychiatrists table (for full name and specialization)
            const updatePsychiatristQuery = `
                UPDATE Psychiatrists 
                SET full_name = ?, specialization = ? 
                WHERE psychiatrist_id = ?;
            `;

            db.query(updatePsychiatristQuery, [fullName, specialization, psychiatristId], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error updating psychiatrist details', error: err });
                }

                res.status(200).json({ message: 'Psychiatrist details updated successfully' });
            });
        });
    });
};

const deletePsychiatrist = (req, res) => {
    const psychiatristId = req.params.id;

    // First, retrieve the user_id from the Psychiatrists table
    const getUserIdQuery = `
        SELECT user_id FROM Psychiatrists WHERE psychiatrist_id = ?;
    `;

    db.query(getUserIdQuery, [psychiatristId], (err, results) => {
        if (err) {
            console.error('Error retrieving user_id:', err);
            return res.status(500).json({ message: 'Error retrieving user_id', error: err });
        }

        // If no psychiatrist is found
        if (results.length === 0) {
            return res.status(404).json({ message: 'Psychiatrist not found' });
        }

        const userId = results[0].user_id;

        // First delete from the Psychiatrists table
        const deletePsychiatristQuery = `
            DELETE FROM Psychiatrists WHERE psychiatrist_id = ?;
        `;

        db.query(deletePsychiatristQuery, [psychiatristId], (err) => {
            if (err) {
                console.error('Error deleting psychiatrist:', err);
                return res.status(500).json({ message: 'Error deleting psychiatrist', error: err });
            }

            // Now delete from the Users table
            const deleteUserQuery = `
                DELETE FROM Users WHERE user_id = ?;
            `;

            db.query(deleteUserQuery, [userId], (err) => {
                if (err) {
                    console.error('Error deleting user:', err);
                    return res.status(500).json({ message: 'Error deleting user', error: err });
                }

                res.status(200).json({ message: 'Psychiatrist and associated user deleted successfully' });
            });
        });
    });
};




//Patient Controller Functions

const getPatients = (req, res) => {
    const query = `
        SELECT p.patient_id, p.full_name, u.email, 
               DATE_FORMAT(p.date_of_birth, '%Y-%m-%d') as date_of_birth, 
               p.emergency_contact_name, p.emergency_contact_no
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


const getPatientById = (req, res) => {
    const patientId = req.params.id;
    const query = `
        SELECT p.patient_id, p.full_name, u.email, p.date_of_birth, p.address, 
               p.emergency_contact_name, p.emergency_contact_no, p.gender, u.created_at
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

    console.log(req.session);
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
    const contentID = req.params.id;
    console.log('Deleting content with ID:', contentID); // Debugging

    if (!contentID) {
        return res.status(400).json({ message: 'Content ID is missing' });
    }

    const query = `
        DELETE FROM WellnessContent
        WHERE contentID = ?;
    `;

    db.query(query, [contentID], (err) => {
        if (err) {
            console.error('Error executing delete query:', err); // Debugging
            return res.status(500).json({ message: 'Error deleting wellness content', error: err });
        }
        console.log('Content deleted successfully'); // Debugging
        res.status(200).json({ message: 'Wellness content deleted successfully' });
    });
};


const addWellnessContent = (req, res) => {
    const { imageLink, contentCategory, description, videoLink } = req.body;

    console.log('Received category:', contentCategory); // Log to verify if the category is being received

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
