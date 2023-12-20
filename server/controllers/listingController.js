const { error } = require('console');
const Listing = require('../models/Listing');
const { errorHandler } = require('../utilis/errorHandler');

// @desc Create a Listing middleware
// @route POST /create
// @access Public
const create = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}

// @desc Delete a Listing middleware
// @route DELETE /delete/:id
// @access Public
const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)

    if (!listing) {
        return next(errorHandler(401, 'You can only delete your own listing!'))
    }

    // if userID in JWT are not equal with found listing's userRef
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(410, 'You can only delete your own listing!'))
    }

    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json('Listing has been deleted!')
    } catch (error) {
        next(error)
    }
}

// @desc Update a Listing middleware
// @route POST /update/:id
// @access Public
const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)

    if (!listing) {
        return next(errorHandler(404, 'Listing not found!'))
    }

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, 'You can only update your own listing!'))
    }

    try {
        const updateListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.status(200).json(updateListing)
    } catch (error) {
        next(error)
    }
}

// @desc Get a Listing with ID for Edit Listing middleware
// @route GET /get/:id
// @access Public
const getListingWithId = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id)
        if (!listing) {
            return next(errorHandler(404, 'Listing not Found!'))
        }
        res.status(200).json(listing)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    create,
    deleteListing,
    updateListing,
    getListingWithId,
}