const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../utilis/verifyToken');

router.get('/test', userController.test);
router.post('/update/:id', verifyToken, userController.updateUser);
router.delete('/delete/:id', verifyToken, userController.deleteUser);
router.get('/listings/:id', verifyToken, userController.getUserListings)
router.get('/:id', verifyToken, userController.getUser)

module.exports = router;