const express = require('express');
const router = express.Router();

const messagesController = require('../controllers/messages.controller');
const secureMiddleware = require('../middleware/secure.middleware');
const userAccessMiddleware = require('../middleware/user-access.middleware');

/* GET Chats listing. */

router.get('/:idUser/messages/:groupName', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, messagesController.get);
// router.get('/:idUser/messages/:groupName', messagesController.get);


module.exports = router;