const {Router} = require('express');
const router = Router();

const { defaultResponse } = require('../controllers/default-controller');

router.get('/', defaultResponse);


module.exports = router;