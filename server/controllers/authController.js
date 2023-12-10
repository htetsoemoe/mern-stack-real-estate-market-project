const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { errorHandler } = require('../utilis/errorHandler');
const jwt = require('jsonwebtoken');

// @desc Sign Up middleware
// @route POST /signup
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

// @desc Sign In middleware
// @route POST /signin
// @access Public
const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User Not Found!'));  // this next middleware called and passed 'error' to default error handler middleware of server.js

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Wrong Password!'));  // this next middleware called and passed 'error' to default error handler middleware of server.js

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        // remove validUser password 
        const { password: pass, ...rest } = validUser._doc;

        res.cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest);

    } catch (error) {
        next(error);
    }
}

module.exports = {
    singUp,
    signIn,
}