const Usermodel = require('../models/usermodel')
const jwt = require('jsonwebtoken');
require("dotenv").config();

// User login authentication
exports.authlogin = (req, res, next) => {
    try {
        const decode = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
        req.user = decode;
        next();

    } catch (error) {
        console.log('Authentication Failed')
        return res.status(400).send({ message: 'Please Login First' })
    }
}


// Admin Panel
exports.Admin = async (req, res, next) => {
    try {
        const user = await Usermodel.findById(req.user._id)
        if (user.role != 1) {
            return res.status(400).send({ message: 'Unauthorized Access' })
        }
        else {
            next();
        }

    } catch (error) {
        console.log(error)
        res.status(400).send({ message: 'Unauthorized Access' })
    }
}