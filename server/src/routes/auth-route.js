const {Router} = require('express');
const router = Router();

const { getAllUsers, signup, login, logout } = require('../controllers/auth-controller')
const { registerValidation, loginValidation } = require('../validators/auth');
const { validationMiddleware } = require('../middlewares/validations-middleware');
const { userAuth } = require('../middlewares/auth-middleware');

// TODO need fixed with admin account strategy
router.get('/get-all-users', getAllUsers);

router.post('/signup', registerValidation, validationMiddleware, signup);
router.post('/login', loginValidation, validationMiddleware, login);
router.get('/logout', userAuth, logout);

module.exports = router;