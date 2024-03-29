const express = require('express');
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config({ path: './Backend/.env.local' });
const router = express.Router();
const fetchUser = require('../middleware/fetchUser.js');

const secretKey = process.env.JWT_SECRET;

// Route 1: create a user using : POST "/createUser"
router.post('/createUser', [
    body('name', 'Enter a valid name!').isLength({ min: 3 }),
    body('email', 'Enter a valid email!').isEmail(),
    body('password', 'Password should be minimum of 5 length').isLength({ min: 5 }),
], async (request, response) => {
    // if there are errors return bad request
    let success = false;
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({
            success, 
            errors: errors.array()
        });
    }
    // check whether email already exists already
    try {
        let user = await User.findOne({ email: request.body.email });
        if (user) {
            return response.status(400).json( {success, "error": "Already exists a user with this email!" });
        }
        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(request.body.password, salt);
        request.body.password = securedPassword;
        user = User(request.body) // create new user if not
        await user.save();
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, secretKey);
        success = true;
        response.send({success, authToken});
        console.log("User Added Successfully!");
    }
    catch (err) {
        console.error(err.message);
        success = false;
        response.status(400).send({success, error: "Internal Error Occured!"});
    }
});

// ***************************************************************************************


//Route 2:  authenticate a user
router.post('/login', [
    body('email', 'Enter a valid email address!').isEmail(),
    body('password', 'Password cannot be blank!').exists(),
], async (request, response) => {
    // if there are errors return bad request
    let success = false;
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json( {success,
            errors: errors.array()
        });
    }

    const { email, password } = request.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return response.status(400).json({success, 
                "error": "Incorrect Credentials!"
            });
        }

        const comparedPassword = await bcrypt.compare(password, user.password);
        if (!comparedPassword) {
            return response.status(400).json( {success,
                "error": "Incorrect Credentials!"
            });
        }

        const payload = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(payload, secretKey);
        success = true;
        response.send( {success, authToken });

    }
    catch (error) {
        console.log(error.message);
        success = false;
        response.status(500).json({
            success,
            "error": "Internal Server Occured!"
        });
    }
})


//*************************************************************************************

// Route 3 : Fetch logged in user details - login required
// Route 3: Fetch logged-in user details - login required
router.post('/fetchDetails', fetchUser, async (request, response) => {
    let success = false;
    try {
        let userId = request.user.id;
        console.log(userId);
        const user = await User.findById(userId).select("-password");
        console.log(user);
        success = true;
        response.send({success, user}); // Send user details in the response
    } catch (error) {
        console.log(error.message);
        success = false;
        response.status(500).json( {success,
            "error": "Internal Server Error Occurred!"
        });
    }
});

module.exports = router;