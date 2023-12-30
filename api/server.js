require('dotenv').config();
const express = require('express');
// const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const cookieParser = require('cookie-parser');
const path = require('path')

const PORT = process.env.PORT || 3500;
const app = express();

app.use(express.json());
app.use(cookieParser());

console.log(process.env.NODE_ENV);
connectDB();
// app.use(cors(corsOptions));

const ___dirname = path.resolve()

app.use('/api/listing/', require('./routes/listingRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

app.use(express.static(path.join(___dirname, '/client/dist'))) // use static files(frontend project)

app.get('*', (req, res) => {
    res.sendFile(path.join(___dirname, 'client', 'dist', 'index.html'))
})

// default error handler middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(statusCode).json({
        //text: 'default error handler from server.js',
        success: false,
        statusCode,
        message,
    });
});

mongoose.connection.once('open', () => {
    console.log('Connect to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', err => {
    console.log(err);
});