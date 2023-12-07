const User = require('../models/User');
const bcrypt = require('bcryptjs')

const test = (req, res) => {
    res.json({
        message: 'Api is working fine!'
    });
}

module.exports = {
    test,
}