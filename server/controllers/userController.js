const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { errorHandler } = require('../utilis/errorHandler');
const Listing = require('../models/Listing');
const { error } = require('console');

const test = (req, res) => {
    res.json({
        message: 'Api is working fine!'
    });
}

// @desc Update User Information middleware
// @route POST /update/:id
// @access Public
const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only update your own account.'))
    }

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                }
            },
            { new: true }
        )

        const { password, ...rest } = updatedUser._doc
        res.status(200).json(rest)

    } catch (error) {
        next(error)
    }
}

// @desc Delete User middleware
// @route DELETE /delete/:id
// @access Public
const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only delete your own account.'))
    }

    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token')
        res.status(200).json('User has been deleted!')
    } catch (error) {
        next(error)
    }
}

// @desc Get User Listings Middleware
// @route GET /listings/:id
// @access Public
const getUserListings = async (req, res, next) => {
    // check userId in incoming request(from JWT in cookie) and userId in request param
    if (req.user.id === req.params.id) {
        try {
            const listings = await Listing.find({ userRef: req.params.id })
            res.status(200).json(listings)
        } catch (error) {
            next(error)
        }
    } else {
        return next(errorHandler(401, 'You can only view your own listings!'))
    }
}

module.exports = {
    test,
    updateUser,
    deleteUser,
    getUserListings,
}