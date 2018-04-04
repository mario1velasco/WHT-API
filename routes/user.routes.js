const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller');
const secureMiddleware = require('../middleware/secure.middleware');

router.get('/:id', secureMiddleware.isAuthenticated, usersController.get);
router.post('/', usersController.create);

module.exports = router;
