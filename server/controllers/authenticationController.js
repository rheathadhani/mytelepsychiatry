const db = require('../db');

// Function to handle login without password hashing
const loginUser = (req, res) => {
    const { email, password, role } = req.body;

    const query = `
        SELECT * FROM Users 
        WHERE email = ? AND role = ?;
    `;

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

        req.session.userId = user.id;
        req.session.userRole = user.role;
        
        console.log('Session after login:', req.session);  // Debug log

        res.status(200).json({
            message: 'Login successful',
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
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
