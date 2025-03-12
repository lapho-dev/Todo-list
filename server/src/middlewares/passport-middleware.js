const passport = require('passport');
const { Strategy } = require('passport-jwt');
const { SECRET } = require('../constants')
const db = require('../db');

const cookieExtractor = function (req) {
    let token = null;
    token = req?.cookies?.['token'] || null;
    return token
}

const opts = {
    secretOrKey: SECRET,
    jwtFromRequest: cookieExtractor,
}

passport.use(
    new Strategy(opts, async ({ user_id }, done) => {
        try {
            const response = await db.query(
                'SELECT user_id, username, email FROM users_table WHERE user_id = $1',
                [user_id]
            );

            if (!response.rows.length) {
                throw new Error('401 not authorized.')
            };

            const user = {
                user_id: response.rows[0].user_id,
                username: response.rows[0].username,
                email: response.rows[0].email,
            };
            
            return await done(null, user);

        } catch (error) {
            console.error(error.message);
            done(null, false)
        }
    })
)