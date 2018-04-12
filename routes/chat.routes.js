const express = require('express');
const router = express.Router();

const chatsController = require('../controllers/chats.controller');
const secureMiddleware = require('../middleware/secure.middleware');
const userAccessMiddleware = require('../middleware/user-access.middleware');

/* GET Chats listing. */
// router.get('/:idUser/chats', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, chatsController.show);
router.get('/:idUser/chats', chatsController.show);

// router.get('/:idUser/chatsName', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, chatsController.show);
router.get('/:idUser/chats/:groupName', chatsController.get);

router.get('/:idUser/showallchats', chatsController.showAll);

// router.post('/:idUser/chats', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, chatsController.create);
router.post('/:idUser/chats', chatsController.create);

// router.put('/:idUser/:groupName/adduser', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, chatsController.create);
router.put('/:idUser/chats/:groupName/addUser', chatsController.addUser);

// router.get('/:idUser/chats/:id', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, chatsController.show);
router.put('/:idUser/chats/:groupName/leaveChat', chatsController.leaveChat);

// router.put('/:idUser/chats/:id', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, chatsController.update);

// router.delete('/:idUser/chats/:id', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, chatsController.delete);

module.exports = router;