const Listing = require('../models/Listing');

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

module.exports = {
    create,
}