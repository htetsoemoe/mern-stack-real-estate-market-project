const express = require('express');
const router = express.Router();
const listController = require('../controllers/listingController');
const verifyToken = require('../utilis/verifyToken');

router.post('/create', verifyToken, listController.create);
router.delete('/delete/:id', verifyToken, listController.deleteListing)
router.post('/update/:id', verifyToken, listController.updateListing)

module.exports = router;