const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../utilis/verifyToken');

router.get('/test', userController.test);
router.post('/update/:id', verifyToken, userController.updateUser);

module.exports = router;