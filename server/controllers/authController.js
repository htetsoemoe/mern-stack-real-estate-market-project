const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { errorHandler } = require('../utilis/errorHandler');

// @desc Sign Up middleware
// @route POST /
// @access Public
const singUp = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).json('User created successfully!');
    } catch (error) {
        // next(errorHandler(500, "Internal Server Error"));
        next(error);
    }
}

module.exports = {
    singUp,
}