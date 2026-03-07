// ########################################
// ########## SETUP

const express = require('express');
const path = require('path');
const app = express();

// cors stuff
const cors = require('cors');
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json()); // this is needed for post requests

app.use(express.static(path.join(__dirname, 'dist')));

const PORT = 9972;

// ########################################
// ########## ROUTE HANDLERS

// Handles any requests that don't match the ones above to return the React app
// A request to '/nonExist' will redirect to the index.html where react router takes over at '/'
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// ########################################
// ########## LISTENER

app.listen(PORT, () => {
    console.log(`Server running: http://127.0.0.1:${PORT}...`);
});