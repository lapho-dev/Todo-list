const {check} = require('express-validator');
const db = require('../db');
const {compare} = require('bcryptjs');

// Password Check
const password = check('password').isLength({min: 5, max:15}).withMessage('Password has to be between 6 and 15 characters.');

// Email Check
const email = check('email').isEmail().withMessage('Please provide a valide email.');

// Email Existence Check
const emailExists = check('email').custom(async (email) => {
    const { rows } = await db.query('SELECT * FROM users_table WHERE email = $1', [
        email,
    ])

    if (rows.length) {
        throw new Error('Email already exists.');
    };
}).withMessage('Email already exists.');



// Login Validation
const loginFieldsCheck = check('email').custom(async (email, { req }) => {
    // Check if password is provided
    if (!req.body.password) {
        throw new Error('Password is not provided.')
    }

    // Query User with email or username
    let user;
    if (email) {
        user = await db.query('SELECT * FROM users_table WHERE email = $1', [email]);  
    } else if (req.body.username) {
        user = await db.query('SELECT * FROM users_table WHERE username = $1', [req.body.username])
    } else {
        throw new Error('Both email and username are not provided.');
    }

    // Check if user queried exist
    if (!user.rows.length) {
        throw new Error('Email does not exists.');
    }

    const validPassword = await compare(req.body.password, user.rows[0].password)

    if (!validPassword) {
        throw new Error('Wrong password');
    }

    req.user = user.rows[0];
});


// exports
module.exports = {
    registerValidation: [email, password, emailExists],
    loginValidation: [loginFieldsCheck],
};