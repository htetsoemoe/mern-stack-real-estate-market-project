const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

router.route('/signup')
    .post(authController.singUp)

router.route('/signin')
    .post(authController.signIn)

router.route('/google')
    .post(authController.google)

module.exports = router;