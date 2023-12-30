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

// @desc Google Authentication middleware
// @route POST /google
// @access Public
const google = async (req, res, next) => {
    try {
        // Firstly, we need to find the user with email in request object
        const user = await User.findOne({ email: req.body.email })

        // If user was found
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            const { password: pass, ...rest } = user._doc
            res.cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest)

        } else {    // If user was not found, create new user using Google OAuth result
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)   // Math.random().toString(36).slice(-8) returns 'wdxgfa6i'
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
            const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, password: hashedPassword, avatar: req.body.photo })
            await newUser.save()
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
            const { password: pass, ...rest } = newUser._doc
            res.cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest)
        }
    } catch (error) {
        next(error)
    }
}

// @desc User SignOut middleware
// @route GET /signout
// @access Public
const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token')
        res.status(200).json('User has been logged out!')
    } catch (error) {
        next(error)
    }
}

module.exports = {
    singUp,
    signIn,
    google,
    signout,
}