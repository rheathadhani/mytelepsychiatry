const db = require("../db.js")

// Login Controller
const loginUser = (req, res) => {
    const { email, password, role } = req.body;

    const query = `SELECT * FROM Users WHERE email = ? AND role = ?;`;

    db.query(query, [email, role], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or role' });
        }

        const user = results[0];

        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Log user query result
        console.log('User query results:', user);

        // Set the session data based on user role
        req.session.userId = user.user_id;
        req.session.userRole = user.role;
        req.session.isLoggedIn = true;

        if (role === 'patient') {
            const patientQuery = `SELECT patient_id FROM Patients WHERE user_id = ?`;

            db.query(patientQuery, [user.user_id], (err, patientResults) => {
                if (err) {
                    console.error('Error fetching patient details:', err);
                    return res.status(500).json({ message: 'Error fetching patient details' });
                }

                if (patientResults.length === 0) {
                    return res.status(404).json({ message: 'Patient not found' });
                }

                const patient = patientResults[0];
                req.session.patientId = patient.patient_id; // Store patientId in session

                res.status(200).json({
                    message: 'Login successful',
                    user: {
                        user_id: user.user_id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        patient_id: patient.patient_id // Include patient ID in the response
                    }
                });
            });
        } else {
            // Return success for non-patient roles
            res.status(200).json({
                message: 'Login successful',
                user: {
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        }
    });
};

// Function to handle patient registration
const registerPatient = (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const fullName = `${firstName} ${lastName}`;

    // Check if the email already exists
    const emailCheckQuery = `SELECT * FROM Users WHERE email = ?`;

    db.query(emailCheckQuery, [email], (err, results) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).send('Server error');
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Insert into Users table
        const userInsertQuery = `
            INSERT INTO Users (username, password, email, role)
            VALUES (?, ?, ?, 'patient');
        `;

        db.query(userInsertQuery, [fullName, password, email], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).send('Server error');
            }

            const userId = result.insertId; // Get the newly inserted user's ID

            // Insert into Patients table
            const patientInsertQuery = `
                INSERT INTO Patients (user_id, full_name)
                VALUES (?, ?);
            `;

            db.query(patientInsertQuery, [userId, fullName], (err, patientResult) => {
                if (err) {
                    console.error('Error inserting patient:', err);
                    return res.status(500).send('Server error');
                }

                // Respond with success message
                res.status(201).json({
                    message: 'Patient registered successfully',
                    user: {
                        user_id: userId,
                        username: fullName,
                        email: email,
                        role: 'patient'
                    }
                });
            });
        });
    });
};

module.exports = {
    loginUser,
    registerPatient
};
