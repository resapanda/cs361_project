// ########################################
// ########## SETUP

// Database
const db = require('./database/db-connector');

// Express
const express = require('express');
const axios = require('axios');
const app = express();

// Middleware
const cors = require('cors');
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json()); // this is needed for post requests


const PORT = 9971;

const bcrypt = require('bcryptjs');

// microservices url
const UNIT_SERVICE_URL = 'http://127.0.0.1:6901';


// ########################################
// ########## ROUTE HANDLERS

// MICROSERVICE
app.post('/api/convert', async (req, res) => {
    try {
        const response = await axios.post(`${UNIT_SERVICE_URL}/convert-unit`, req.body);
        
        res.json(response.data);
    } catch (error) {
        console.error("Error calling Unit Conversion Microservice:", error.message);
        res.status(500).json({ error: "Microservice unreachable" });
    }
});

app.listen(9971, () => console.log('Main Backend running on port 9971'));


// REGISTER ROUTE
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = `INSERT INTO Users (email, password_hash) VALUES (?, ?);`;
        await db.query(query, [email, hashedPassword]);

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        // Handle duplicate emails
        if (error.errno === 1062) {
            return res.status(400).json({ error: "Email already exists." });
        }
        console.error(error);
        res.status(500).json({ error: "Server error during registration." });
    }
});

// LOGIN ROUTE
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        // Compare entered password with the hashed password in DB
        const isMatch = await bcrypt.compare(password, users[0].password_hash);
        
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        res.status(200).json({ 
            message: "Login successful!",
            userId: users[0].user_id 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error during login." });
    }
});


// READ ROUTES
app.get('/home/:userId', async (req, res) => {
    try {
        const { userId } = req.params; 
        // Create and execute our queries
        const query1 = `SELECT * FROM Profiles WHERE user_id = ? ORDER BY name ASC;`;
        const [profiles] = await db.query(query1, [userId]);

        res.status(200).json({ profiles });  // Send the results to the frontend

    } catch (error) {
        console.error("Error fetching home profiles:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while loading your home page.");
    }
});

app.get('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        // Create and execute our queries
        const query1 = `SELECT * FROM Profiles WHERE user_id = ?;`;
        const [profiles] = await db.query(query1, [userId]);

        res.status(200).json({ profiles });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while An error occurred while loading your profile page.");
    }
});

app.get('/health/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        // Create and execute our queries
        const query1 = `
            SELECT DailyCheckins.* FROM DailyCheckins 
            JOIN Profiles ON DailyCheckins.profile_id = Profiles.profile_id 
            WHERE Profiles.user_id = ?`;
        const [dailyCheckIns] = await db.query(query1, [userId]);
        const query2 = `
            SELECT VetRecords.* FROM VetRecords 
            JOIN Profiles ON VetRecords.profile_id = Profiles.profile_id 
            WHERE Profiles.user_id = ?`;
        const [vetRecords] = await db.query(query2, [userId]);
        const [profiles] = await db.query('SELECT * FROM Profiles WHERE user_id = ? ORDER BY name ASC;', [userId]);

        res.status(200).json({ dailyCheckIns, vetRecords, profiles });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while loading your health record page.");
    }
});

// CREATE ROUTE
app.post('/home/quick-checkin', async (req, res) => {
    try {
        // Parse frontend form information
        const data = req.body;
        
        // Create and execute our queries
        const query1 = `CALL sp_create_daily_checkin(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @new_id);`;

        await db.query(query1, [
            data.pet_id,
            data.date,             
            data.food_morning, 
            data.food_treat,
            data.food_night,
            data.toilet_pee,
            data.toilet_poop,
            data.mood,             
            'n/a',                
            'Quick check-in from Home' 
        ]);

        const query2 = `SELECT @new_id AS new_id;`;
        const [[rows]] = await db.query(query2);
        
        res.status(201).json({ 
            message: "Quick check-in saved!", 
            id: rows.new_id 
        });
    } catch (error) {
        console.error("Error saving quick check-in:", error);
        res.status(500).json({ error: "Failed to save check-in." });
    }
});

app.post('/profile/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Casting
        const userIdInt = parseInt(data.user_id, 10);
        const profileAgeInt = parseInt(data.create_profile_age, 10);

        // Create and execute our queries
        const query1 = `CALL sp_create_profile(?, ?, ?, ?, ?, ?, ?, ?, @new_id);`;

        await db.query(query1, [
            userIdInt,
            data.create_profile_name,
            data.create_profile_gender,
            profileAgeInt,
            data.create_profile_breed,
            data.create_profile_weight,
            data.create_profile_unit,
            data.create_profile_photo
        ]);

        const query2 = `SELECT @new_id AS new_id;`;
        const [[rows]] = await db.query(query2);

        console.log(`CREATE Profiles. ID: ${rows.new_id} ` +
            `Name: ${data.create_profile_name} `
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Profile created successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/daily_checkin/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Casting
        const profileIdInt = parseInt(data.create_daily_checkin_pet_id, 10);

        // Create and execute our queries
        const query1 = `CALL sp_create_daily_checkin(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @new_id);`;

        await db.query(query1, [
            profileIdInt,
            data.create_daily_checkin_date,
            data.create_daily_checkin_morning,
            data.create_daily_checkin_treat,
            data.create_daily_checkin_night,
            data.create_daily_checkin_pee,
            data.create_daily_checkin_poop,
            data.create_daily_checkin_mood,
            data.create_daily_checkin_symptoms,
            data.create_daily_checkin_note
        ]);

        const query2 = `SELECT @new_id AS new_id;`;
        const [[rows]] = await db.query(query2);

        console.log(`CREATE DailyCheckins. ID: ${rows.new_id} ` +
            `Name: ${data.create_daily_checkin_date} `
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Daily Check-In created successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/vet_record/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Casting
        const profileIdInt = parseInt(data.create_vet_record_pet_id, 10);

        // Create and execute our queries
        const query1 = `CALL sp_create_vet_record(?, ?, ?, ?, ?, ?, @new_id);`;

        await db.query(query1, [
            profileIdInt,
            data.create_vet_record_date,
            data.create_vet_record_clinic,
            data.create_vet_record_diagnosis,
            data.create_vet_record_note,
            data.create_vet_record_pdf
        ]);

        const query2 = `SELECT @new_id AS new_id;`;
        const [[rows]] = await db.query(query2);

        console.log(`CREATE VetRecords. ID: ${rows.new_id} ` +
            `Name: ${data.create_vet_record_date} `
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Vet Record created successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

// DELETE ROUTE
app.delete('/profile/delete', async function (req, res) {
    try {
        const data = req.body;

        if (!data.delete_profile_id) {
            return res.status(400).json({ success: false, error: 'Missing ID' });
        }
        
        const query = `CALL sp_Delete(?, ?, ?);`;
        
        await db.query(query, ['Profiles', 'profile_id', data.delete_profile_id]);

        console.log(`Deleted Profile ID: ${data.delete_profile_id}`);
        res.json({ success: true });

    } catch (error) {
        console.error("Error in /profile/delete:", error);
        
        // CHECK FOR FOREIGN KEY ERROR
        if (error.errno === 1451) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete: This item is currently linked to an active record." 
            });
        }
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

app.delete('/daily_checkin/delete', async function (req, res) {
    try {
        const data = req.body;

        if (!data.delete_daily_checkin_id) {
            return res.status(400).json({ success: false, error: 'Missing ID' });
        }
        
        const query = `CALL sp_Delete(?, ?, ?);`;
        
        await db.query(query, ['DailyCheckins', 'daily_checkin_id', data.delete_daily_checkin_id]);

        console.log(`Deleted Daily Check-In ID: ${data.delete_daily_checkin_id}`);
        res.json({ success: true });

    } catch (error) {
        console.error("Error in /daily_checkin/delete:", error);
        
        // CHECK FOR FOREIGN KEY ERROR
        if (error.errno === 1451) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete: This item is currently linked to an active record." 
            });
        }
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

app.delete('/vet_record/delete', async function (req, res) {
    try {
        const data = req.body;

        if (!data.delete_vet_record_id) {
            return res.status(400).json({ success: false, error: 'Missing ID' });
        }
        
        const query = `CALL sp_Delete(?, ?, ?);`;
        
        await db.query(query, ['VetRecords', 'vet_record_id', data.delete_vet_record_id]);

        console.log(`Deleted Vet Record ID: ${data.delete_vet_record_id}`);
        res.json({ success: true });

    } catch (error) {
        console.error("Error in /vet_record/delete:", error);
        
        // CHECK FOR FOREIGN KEY ERROR
        if (error.errno === 1451) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete: This item is currently linked to an active record." 
            });
        }
        res.status(500).json({ success: false, error: 'Database error' });
    }
});


// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log('Express started on http://127.0.0.1:' + PORT + '; press Ctrl-C to terminate.');
});
