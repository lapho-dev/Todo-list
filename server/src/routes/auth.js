const {Router} = require('express');
const router = Router();

const { getAllUsers, signup, login, protectedRoute, logout } = require('../controllers/auth')
const { registerValidation, loginValidation } = require('../validators/auth');
const { validationMiddleware } = require('../middlewares/validations-middleware');
const { userAuth } = require('../middlewares/auth-middleware');


router.get('/get-all-users', getAllUsers);
router.get('/protected', userAuth, protectedRoute);
router.post('/signup', registerValidation, validationMiddleware, signup);
router.post('/login', loginValidation, validationMiddleware, login);
router.get('/logout', userAuth, logout);

module.exports = router;