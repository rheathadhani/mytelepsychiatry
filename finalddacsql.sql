-- Specify the database
CREATE DATABASE ddac;
USE ddac;
 
-- Create Users Table
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('patient','psychiatrist','admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Patients Table
CREATE TABLE Patients (
    patient_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    address VARCHAR(256),
    gender ENUM ('Female', 'Male', 'Others'), 
    emergency_contact_name VARCHAR(100), 
    emergency_contact_no VARCHAR(15), 
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Create Psychiatrists Table
CREATE TABLE Psychiatrists (
    psychiatrist_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,	
    full_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
			
-- Create Symptoms Table
CREATE TABLE Symptoms (
    symptom_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    date_logged DATE,
    symptom_details TEXT,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE
);

-- Create Appointments Table
CREATE TABLE Appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    psychiatrist_id INT,
    meeting_link VARCHAR(100),
    appointment_date DATETIME NOT NULL,
    status ENUM('scheduled', 'completed', 'ongoing') DEFAULT 'scheduled',
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (psychiatrist_id) REFERENCES Psychiatrists(psychiatrist_id) ON DELETE CASCADE
);
  
-- Create Prescriptions Table
CREATE TABLE Prescriptions (
    prescription_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    psychiatrist_id INT,
    medicine_name VARCHAR(100),
    dosage VARCHAR(50),
    frequency_per_day INT,
    duration_in_days INT,
    prescribed_date DATE,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (psychiatrist_id) REFERENCES Psychiatrists(psychiatrist_id) ON DELETE CASCADE
);
 
-- Create ClinicalNotes Table
CREATE TABLE ClinicalNotes (
    note_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    psychiatrist_id INT,
    note_text TEXT,
    note_date DATE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (psychiatrist_id) REFERENCES Psychiatrists(psychiatrist_id) ON DELETE CASCADE
);
 
-- Create WellnessContent Table
CREATE TABLE WellnessContent (
    contentID INT PRIMARY KEY AUTO_INCREMENT,
    content_category ENUM('mindfullness', 'exercise', 'nutrition'),
    image_link VARCHAR(255),
    description VARCHAR(255),
    video_link VARCHAR(255)
);
 
 
-- Create Payments Table
CREATE TABLE Payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    appointment_id INT,
    payment_method ENUM('bank_transfer', 'qr_payment') NOT NULL,
    payment_proof VARCHAR(255),
    payment_amount DECIMAL(10, 2) DEFAULT 50.00,
    bank_account_name VARCHAR(255) DEFAULT 'MYTelepsychiatry Sdn. Bhd.',
    bank_account_number VARCHAR(50) DEFAULT '1231 7362 0909, Maybank',
    payment_status ENUM('pending', 'completed') DEFAULT 'pending',
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id) ON DELETE CASCADE
);

-- Users Table
INSERT INTO Users (password, email, role) VALUES ('johndoe', 'johndoe@gmail.com', 'patient');
INSERT INTO Users (password, email, role) VALUES ('mary.smith', 'mary.smith@gmail.com', 'psychiatrist');
INSERT INTO Users (password, email, role) VALUES ('alice.johnson', 'alice.johnson@gmail.com', 'admin');
INSERT INTO Users (password, email, role) VALUES ('b0bbr0wn', 'bobbrown@gmail.com', 'patient');
INSERT INTO Users (password, email, role) VALUES ('charlie.davis', 'charlie.davis@gmail.com', 'psychiatrist');
INSERT INTO Users (password, email, role) VALUES ('d@n@ev@ns', 'danaevans@gmail.com', 'psychiatrist');
INSERT INTO Users (password, email, role) VALUES ('evanf0x', 'evanfox@gmail.com', 'patient');
INSERT INTO Users (password, email, role) VALUES ('frangarci@', 'frangarcia@gmail.com', 'psychiatrist');
INSERT INTO Users (password, email, role) VALUES ('gus.hall', 'gus.hall@gmail.com', 'patient');
INSERT INTO Users (password, email, role) VALUES ('holly10', 'holly.irvine@gmail.com', 'patient');

-- Patients Table
INSERT INTO Patients (user_id, full_name, date_of_birth, address, gender, emergency_contact_name, emergency_contact_no) VALUES (1, 'John Doe', '1990-01-01', '123 Main St', 'Male', 'Jane Doe', '111-222-3333');
INSERT INTO Patients (user_id, full_name, date_of_birth, address, gender, emergency_contact_name, emergency_contact_no) VALUES (2, 'Mary Smith', '1992-02-02', '456 Elm St', 'Female', 'John Smith', '222-333-4444');
INSERT INTO Patients (user_id, full_name, date_of_birth, address, gender, emergency_contact_name, emergency_contact_no) VALUES (3, 'Alice Johnson', '1988-03-03', '789 Oak St', 'Female', 'Bob Johnson', '333-444-5555');
INSERT INTO Patients (user_id, full_name, date_of_birth, address, gender, emergency_contact_name, emergency_contact_no) VALUES (4, 'Bob Brown', '1985-04-04', '321 Pine St', 'Male', 'Sue Brown', '444-555-6666');
INSERT INTO Patients (user_id, full_name, date_of_birth, address, gender, emergency_contact_name, emergency_contact_no) VALUES (5, 'Charlie Davis', '1987-05-05', '654 Maple St', 'Male', 'Dana Davis', '555-666-7777');
INSERT INTO Patients (user_id, full_name, date_of_birth, address, gender, emergency_contact_name, emergency_contact_no) VALUES (6, 'Dana Evans', '1991-06-06', '987 Cedar St', 'Female', 'Evan Davis', '666-777-8888');
INSERT INTO Patients (user_id, full_name, date_of_birth, address, gender, emergency_contact_name, emergency_contact_no) VALUES (7, 'Evan Fox', '1983-07-07', '321 Spruce St', 'Male', 'Fran Fox', '777-888-9999');
INSERT INTO Patients (user_id, full_name, date_of_birth, address, gender, emergency_contact_name, emergency_contact_no) VALUES (8, 'Fran Garcia', '1984-08-08', '123 Birch St', 'Female', 'Gus Garcia', '888-999-0000');
INSERT INTO Patients (user_id, full_name, date_of_birth, address, gender, emergency_contact_name, emergency_contact_no) VALUES (9, 'Gus Hall', '1989-09-09', '456 Redwood St', 'Male', 'Holly Hall', '999-000-1111');
INSERT INTO Patients (user_id, full_name, date_of_birth, address, gender, emergency_contact_name, emergency_contact_no) VALUES (10, 'Holly Irvine', '1982-10-10', '789 Palm St', 'Female', 'Ivy Irvine', '000-111-2222');

-- Psychiatrists Table
INSERT INTO Psychiatrists (user_id, full_name, specialization) VALUES (2, 'Dr. Sam Adams', 'General Psychiatry');
INSERT INTO Psychiatrists (user_id, full_name, specialization) VALUES (5, 'Dr. Lisa Brook', 'General Psychiatry');
INSERT INTO Psychiatrists (user_id, full_name, specialization) VALUES (8, 'Dr. Omar Stone', 'Geriatric Psychiatry');
INSERT INTO Psychiatrists (user_id, full_name, specialization) VALUES (9, 'Dr. Nina Clay', 'Child and Adolescent Psychiatry');
INSERT INTO Psychiatrists (user_id, full_name, specialization) VALUES (10, 'Dr. Kyle Reed', 'Child and Adolescent Psychiatry');
INSERT INTO Psychiatrists (user_id, full_name, specialization) VALUES (11, 'Dr. Julia Moss', 'Geriatric Psychiatry');
INSERT INTO Psychiatrists (user_id, full_name, specialization) VALUES (12, 'Dr. Neil Cube', 'Child and Adolescent Psychiatry');
INSERT INTO Psychiatrists (user_id, full_name, specialization) VALUES (13, 'Dr. Paula Case', 'Geriatric Psychiatry');
INSERT INTO Psychiatrists (user_id, full_name, specialization) VALUES (14, 'Dr. Oliver Dale', 'General Psychiatry');
INSERT INTO Psychiatrists (user_id, full_name, specialization) VALUES (15, 'Dr. Mona Vale', 'Geriatric Psychiatry');

-- Symptoms Table
INSERT INTO Symptoms (patient_id, date_logged, symptom_details) VALUES (1, '2023-01-01', 'Headache and insomnia');
INSERT INTO Symptoms (patient_id, date_logged, symptom_details) VALUES (1, '2023-01-02', 'Fatigue and anxiety');
INSERT INTO Symptoms (patient_id, date_logged, symptom_details) VALUES (2, '2023-01-03', 'Mood swings and dizziness');
INSERT INTO Symptoms (patient_id, date_logged, symptom_details) VALUES (3, '2023-01-04', 'Nausea and palpitations');
INSERT INTO Symptoms (patient_id, date_logged, symptom_details) VALUES (4, '2023-01-05', 'Sweating and tremors');
INSERT INTO Symptoms (patient_id, date_logged, symptom_details) VALUES (5, '2023-01-06', 'Chest pain and cough');
INSERT INTO Symptoms (patient_id, date_logged, symptom_details) VALUES (6, '2023-01-07', 'Fatigue and dizziness');
INSERT INTO Symptoms (patient_id, date_logged, symptom_details) VALUES (7, '2023-01-08', 'Tremors and headaches');
INSERT INTO Symptoms (patient_id, date_logged, symptom_details) VALUES (8, '2023-01-09', 'Nausea and dizziness');
INSERT INTO Symptoms (patient_id, date_logged, symptom_details) VALUES (9, '2023-01-10', 'Anxiety and mood swings');

-- Appointments Table
INSERT INTO Appointments (patient_id, psychiatrist_id, meeting_link, appointment_date, status) VALUES (1, 2, 'www.meet.google.com/mytelepsychiatry-2024', '2023-09-29 10:00:00', 'scheduled');
INSERT INTO Appointments (patient_id, psychiatrist_id, meeting_link, appointment_date, status) VALUES (1, 2, 'www.meet.google.com/mytelepsychiatry-2024', '2023-09-30 10:00:00', 'completed');
INSERT INTO Appointments (patient_id, psychiatrist_id, meeting_link, appointment_date, status) VALUES (2, 2, 'www.meet.google.com/mytelepsychiatry-2024', '2023-10-01 11:00:00', 'scheduled');
INSERT INTO Appointments (patient_id, psychiatrist_id, meeting_link, appointment_date, status) VALUES (3, 5, 'www.meet.google.com/mytelepsychiatry-2024', '2023-10-02 09:00:00', 'ongoing');
INSERT INTO Appointments (patient_id, psychiatrist_id, meeting_link, appointment_date, status) VALUES (4, 5, 'www.meet.google.com/mytelepsychiatry-2024', '2023-10-03 08:00:00', 'scheduled');
INSERT INTO Appointments (patient_id, psychiatrist_id, meeting_link, appointment_date, status) VALUES (5, 2, 'www.meet.google.com/mytelepsychiatry-2024', '2023-10-04 10:00:00', 'completed');
INSERT INTO Appointments (patient_id, psychiatrist_id, meeting_link, appointment_date, status) VALUES (6, 8, 'www.meet.google.com/mytelepsychiatry-2024', '2023-10-05 11:00:00', 'scheduled');
INSERT INTO Appointments (patient_id, psychiatrist_id, meeting_link, appointment_date, status) VALUES (7, 9, 'www.meet.google.com/mytelepsychiatry-2024', '2023-10-06 12:00:00', 'ongoing');
INSERT INTO Appointments (patient_id, psychiatrist_id, meeting_link, appointment_date, status) VALUES (8, 10, 'www.meet.google.com/mytelepsychiatry-2024', '2023-10-07 14:00:00', 'scheduled');
INSERT INTO Appointments (patient_id, psychiatrist_id, meeting_link, appointment_date, status) VALUES (9, 11, 'www.meet.google.com/mytelepsychiatry-2024', '2023-10-08 15:00:00', 'completed');

-- Prescriptions Table
INSERT INTO Prescriptions (patient_id, psychiatrist_id, medicine_name, dosage, frequency_per_day, duration_in_days, prescribed_date) VALUES (1, 2, 'Sertraline', '50 mg', 1, 30, '2023-09-01');
INSERT INTO Prescriptions (patient_id, psychiatrist_id, medicine_name, dosage, frequency_per_day, duration_in_days, prescribed_date) VALUES (1, 2, 'Diazepam', '10 mg', 2, 7, '2023-09-02');
INSERT INTO Prescriptions (patient_id, psychiatrist_id, medicine_name, dosage, frequency_per_day, duration_in_days, prescribed_date) VALUES (2, 5, 'Paroxetine', '20 mg', 1, 30, '2023-09-03');
INSERT INTO Prescriptions (patient_id, psychiatrist_id, medicine_name, dosage, frequency_per_day, duration_in_days, prescribed_date) VALUES (3, 5, 'Lithium', '300 mg', 3, 90, '2023-09-04');
INSERT INTO Prescriptions (patient_id, psychiatrist_id, medicine_name, dosage, frequency_per_day, duration_in_days, prescribed_date) VALUES (4, 2, 'Citalopram', '40 mg', 1, 60, '2023-09-05');
INSERT INTO Prescriptions (patient_id, psychiatrist_id, medicine_name, dosage, frequency_per_day, duration_in_days, prescribed_date) VALUES (5, 8, 'Zoloft', '100 mg', 1, 30, '2023-09-06');
INSERT INTO Prescriptions (patient_id, psychiatrist_id, medicine_name, dosage, frequency_per_day, duration_in_days, prescribed_date) VALUES (6, 9, 'Fluoxetine', '20 mg', 1, 45, '2023-09-07');
INSERT INTO Prescriptions (patient_id, psychiatrist_id, medicine_name, dosage, frequency_per_day, duration_in_days, prescribed_date) VALUES (7, 10, 'Escitalopram', '10 mg', 1, 30, '2023-09-08');
INSERT INTO Prescriptions (patient_id, psychiatrist_id, medicine_name, dosage, frequency_per_day, duration_in_days, prescribed_date) VALUES (8, 11, 'Venlafaxine', '75 mg', 2, 60, '2023-09-09');
INSERT INTO Prescriptions (patient_id, psychiatrist_id, medicine_name, dosage, frequency_per_day, duration_in_days, prescribed_date) VALUES (9, 12, 'Bupropion', '150 mg', 1, 90, '2023-09-10');

-- ClinicalNotes Table
INSERT INTO ClinicalNotes (patient_id, psychiatrist_id, note_text) VALUES (1, 2, 'Patient is responding well to the treatment.');
INSERT INTO ClinicalNotes (patient_id, psychiatrist_id, note_text) VALUES (1, 2, 'Adjustments needed for medication dosage.');
INSERT INTO ClinicalNotes (patient_id, psychiatrist_id, note_text) VALUES (2, 5, 'Patient shows signs of improvement but reports side effects.');
INSERT INTO ClinicalNotes (patient_id, psychiatrist_id, note_text) VALUES (3, 5, 'Need to monitor patient closely due to risk of depression worsening.');
INSERT INTO ClinicalNotes (patient_id, psychiatrist_id, note_text) VALUES (4, 2, 'Patient reported feeling better after medication adjustment.');
INSERT INTO ClinicalNotes (patient_id, psychiatrist_id, note_text) VALUES (5, 8, 'Patient experiencing side effects, consider changing medication.');
INSERT INTO ClinicalNotes (patient_id, psychiatrist_id, note_text) VALUES (6, 9, 'Patient shows significant improvement and engagement in therapy.');
INSERT INTO ClinicalNotes (patient_id, psychiatrist_id, note_text) VALUES (7, 10, 'Patient struggling with therapy adherence, plan to discuss strategies.');
INSERT INTO ClinicalNotes (patient_id, psychiatrist_id, note_text) VALUES (8, 11, 'Patient expresses satisfaction with current treatment plan.');
INSERT INTO ClinicalNotes (patient_id, psychiatrist_id, note_text) VALUES (9, 12, 'Patients family involved in treatment planning, positive outlook.');

-- WellnessContent Table
INSERT INTO WellnessContent (content_category, image_link, description, video_link) VALUES ('mindfullness', 'https://img.youtube.com/vi/ZToicYcHIOU/maxresdefault.jpg', 'Daily Calm | 10 Minute Mindfulness Meditation | Be Present.', 'https://www.youtube.com/watch?v=ZToicYcHIOU&t=1s');
INSERT INTO WellnessContent (content_category, image_link, description, video_link) VALUES ('exercise', 'https://img.youtube.com/vi/6OOCR5uNp7s/maxresdefault.jpg', 'The effects of exercise on depression.', 'https://www.youtube.com/watch?v=6OOCR5uNp7s');
INSERT INTO WellnessContent (content_category, image_link, description, video_link) VALUES ('nutrition', 'https://img.youtube.com/vi/qDykQJpxqZk/maxresdefault.jpg', 'DIET FOR DEPRESSION - FOODS GOOD FOR MOOD DISORDERS.', 'https://www.youtube.com/watch?v=qDykQJpxqZk');
INSERT INTO WellnessContent (content_category, image_link, description, video_link) VALUES ('mindfullness', 'https://img.youtube.com/vi/ZToicYcHIOU/maxresdefault.jpg', '5 Minute Mindfulness Meditation.', 'https://www.youtube.com/watch?v=ssss7V1_eyA');
INSERT INTO WellnessContent (content_category, image_link, description, video_link) VALUES ('exercise', 'https://img.youtube.com/vi/hnlAPBbxNko/maxresdefault.jpg', 'The Number One Best Exercise for Depression.', 'https://www.youtube.com/watch?v=hnlAPBbxNko');
INSERT INTO WellnessContent (content_category, image_link, description, video_link) VALUES ('nutrition', 'https://img.youtube.com/vi/T7FaD6jw2vU/maxresdefault.jpg', '12 Foods That Fight Depression and Anxiety.', 'https://www.youtube.com/watch?v=T7FaD6jw2vU');
INSERT INTO WellnessContent (content_category, image_link, description, video_link) VALUES ('mindfullness', 'https://img.youtube.com/vi/wi2Q_7C1OfM/maxresdefault.jpg', 'Techniques for reducing anxiety through mindfulness.', 'https://www.youtube.com/watch?v=wi2Q_7C1OfM&list=PLCQACBUblTbXAgZG7cxMYUddUlvTDO6v1');
INSERT INTO WellnessContent (content_category, image_link, description, video_link) VALUES ('exercise', 'https://img.youtube.com/vi/Sxddnugwu-8/maxresdefault.jpg', 'Yoga For Depression - Yoga With Adriene.', 'https://www.youtube.com/watch?v=Sxddnugwu-8');
INSERT INTO WellnessContent (content_category, image_link, description, video_link) VALUES ('nutrition', 'https://img.youtube.com/vi/zJ7LNvGQMFI/maxresdefault.jpg', 'Foods That Fight Depression.', 'https://www.youtube.com/watch?v=zJ7LNvGQMFI');


-- Payments Table
INSERT INTO Payments (patient_id, appointment_id, payment_method, payment_proof, payment_amount) VALUES (1, 1, 'bank_transfer', '1727458062435payment .pdf', 100.00);
INSERT INTO Payments (patient_id, appointment_id, payment_method, payment_proof, payment_amount) VALUES (2, 3, 'qr_payment', '1727458062435payment .pdf', 150.00);
INSERT INTO Payments (patient_id, appointment_id, payment_method, payment_proof, payment_amount) VALUES (3, 4, 'bank_transfer', '1727458062435payment .pdf', 200.00);
INSERT INTO Payments (patient_id, appointment_id, payment_method, payment_proof, payment_amount) VALUES (4, 5, 'qr_payment', '1727458062435payment .pdf', 250.00);
INSERT INTO Payments (patient_id, appointment_id, payment_method, payment_proof, payment_amount) VALUES (5, 6, 'bank_transfer', '1727458062435payment .pdf', 300.00);
INSERT INTO Payments (patient_id, appointment_id, payment_method, payment_proof, payment_amount) VALUES (6, 7, 'qr_payment', '1727458062435payment .pdf', 350.00);
INSERT INTO Payments (patient_id, appointment_id, payment_method, payment_proof, payment_amount) VALUES (7, 8, 'bank_transfer', '1727458062435payment .pdf', 400.00);
INSERT INTO Payments (patient_id, appointment_id, payment_method, payment_proof, payment_amount) VALUES (8, 9, 'qr_payment', '1727458062435payment .pdf', 450.00);
INSERT INTO Payments (patient_id, appointment_id, payment_method, payment_proof, payment_amount) VALUES (9, 10, 'bank_transfer', '1727458062435payment .pdf', 500.00);
INSERT INTO Payments (patient_id, appointment_id, payment_method, payment_proof, payment_amount) VALUES (10, 11, 'qr_payment', '1727458062435payment .pdf', 550.00);
