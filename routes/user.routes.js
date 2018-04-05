const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller');
const secureMiddleware = require('../middleware/secure.middleware');
const userAccessMiddleware = require('../middleware/user-access.middleware');

router.get('/:id', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, usersController.get);
router.post('/', usersController.create);
// router.put('/:id', usersController.edit);
router.put('/:id', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, usersController.edit);

module.exports = router;
