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

// @desc Get all Listings(default) or criteria search middleware
// @route GET /get/
// @access Public
const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9
        const startIndex = parseInt(req.query.startIndex) || 0

        // If offer if 'undefined' or 'false', get all boolean state of offer
        // Default Behavior
        let offer = req.query.offer
        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] }
        }

        // If furnished if 'undefined' or 'false', get all boolean state of furnished
        // Default Behavior
        let furnished = req.query.furnished
        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] }
        }

        // If parking if 'undefined' or 'false', get all boolean state of parking
        // Default Behavior
        let parking = req.query.parking
        if (parking === undefined || parking === false) {
            parking = { $in: [false, true] }
        }

        // If type if 'undefined' or 'all', get all boolean state of type
        // Default Behavior
        let type = req.query.type
        if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] }
        }

        const searchTerm = req.query.searchTerm || ''
        const sort = req.query.sort || 'createdAt'
        const order = req.query.order || 'desc'

        // Query 
        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
        })
            .sort({ [sort]: order }) // Sets the sort order. If an object is passed, values allowed are asc, desc, ascending, descending, 1, and -1.
            .limit(limit)
            .skip(startIndex)

        return res.status(200).json(listings)

    } catch (error) {
        next(error)
    }
}

module.exports = {
    create,
    deleteListing,
    updateListing,
    getListingWithId,
    getListings,
}