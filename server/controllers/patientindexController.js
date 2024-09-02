// controllers/patientindexController.js
const db = require('../db');

const getPatientName = (req, res) => {
    const patientId = req.params.patientId;
    const query = `
        SELECT 
            full_name 
        FROM 
            Patients 
        WHERE 
            patient_id = ?;
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

const getUpcomingSessions = (req, res) => {
    const patientId = req.params.patientId;
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
    const patientId = req.params.patientId;
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
    const patientId = req.params.patientId;
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

module.exports = {
    getPatientName,
    getUpcomingSessions,
    getMedicationsList,
    getPastAppointments
};
