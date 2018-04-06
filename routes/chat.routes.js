const express = require('express');
const router = express.Router();

const chatsController = require('../controllers/chats.controller');
const secureMiddleware = require('../middleware/secure.middleware');
const userAccessMiddleware = require('../middleware/user-access.middleware');

/* GET Chats listing. */
// router.get('/:idUser/chats', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, chatsController.show);
router.get('/:idUser/chats', chatsController.show);

// router.post('/:idUser/chats', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, chatsController.create);
router.post('/:idUser/chats', chatsController.create);

// router.get('/:idUser/chats/:id', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, chatsController.show);

// router.put('/:idUser/chats/:id', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, chatsController.update);

// router.delete('/:idUser/chats/:id', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, chatsController.delete);

module.exports = router;