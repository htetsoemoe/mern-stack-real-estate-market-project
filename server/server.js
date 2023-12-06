require('dotenv').config();
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

const PORT = process.env.PORT || 3500;
const app = express();

console.log(process.env.NODE_ENV);
connectDB();
app.use(cors(corsOptions));

mongoose.connection.once('open', () => {
    console.log('Connect to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', err => {
    console.log(err);
});