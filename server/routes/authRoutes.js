const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

router.route('/signup')
    .post(authController.singUp)

router.route('/signin')
    .post(authController.signIn)

module.exports = router;