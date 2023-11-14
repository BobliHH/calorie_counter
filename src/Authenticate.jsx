const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { JWT_SECRET } = require('../config/keys');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../models/User');
const Product = require('../models/Product');

// Validate input for registration
const validateRegisterInput = [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
];

// Validate input for login
const validateLoginInput = [
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
];

// @route   POST api/user/register
// @desc    Register user
// @access Public
router.post('/register', validateRegisterInput, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        user = new User({
            name,
            email,
            password
        });

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/user/login