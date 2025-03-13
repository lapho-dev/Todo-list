const db = require('../db');
const { hash } = require('bcryptjs');
const {sign} = require('jsonwebtoken');
const { SECRET } = require('../constants');


/**
 * Get all users from database
 *  
 * @param {*} req 
 * @param {*} res 
 * @returns 
 * 
 * @warning Security issue
 * @todo Please delete or refine this method
 */
exports.getAllUsers = async (req, res)=> {
    try {
         const response = await db.query('SELECT user_id, username, email, created_date FROM users_table'); 
         return res.status(200).json({
            success: true,
            users: response.rows
         });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            error: error.message,
        })
    }
};

/**
 * Login an existing user by email / username and password.
 * 
 * @param {Object} req - The Express request object.
 * @param {string} req - The ID of the todo to retrieve.
 * @param {Object} res - The Express response object.
 */
exports.login = async (req, res)=> {
    let user = req.user;
    const payload = {
        user_id: user.user_id,
        username: user.username,
        email: user.email
    };
    try {
        const token = await sign(payload, SECRET);

         return res.status(200).cookie('token', token, {httpOnly: true}).json({
            success: true,
            message: "Logged in successfully",
            current_user: payload
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({error: error.message})
    }   
};

exports.signup = async (req, res) => {
    const {username, email, password} = req.body;

    try {
        const hashedPassword = await hash(password, 10);
        
        const response = await db.query('INSERT INTO users_table(username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword]);

        const user = {
            user_id: response.rows[0].user_id,
            username: response.rows[0].username,
            email: response.rows[0].email
        };

        const token = await sign(user, SECRET);

        console.log(`New User created. User_id: ${response.rows[0].user_id} Username: ${username}`);

        return res.status(201).cookie('token', token, {httpOnly: true}).json({
            success: true,
            message: "Signup successfully",
            user: user,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({error: error.message})
    }
};

exports.protectedRoute = async (req, res)=> {
    try {
         return res.status(200).json({
            info: 'protected info, secret is "hello world".',
            req: req.body,
         });
    } catch (error) {
        console.error(error.message);
    }
};

exports.logout = async (req, res) => {
    try {
        return res.status(200).clearCookie('token', {httpOnly: true}).json({
            success: true,
            message: "Logout successfully"
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            error: error.message,
        })
    }  
};

