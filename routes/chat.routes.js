const express = require('express');
const router = express.Router();

const chatsController = require('../controllers/chats.controller');
const secureMiddleware = require('../middleware/secure.middleware');
const userAccessMiddleware = require('../middleware/user-access.middleware');

/* GET Chats listing. */
router.get('/:idUser/chats', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, chatsController.show);
// router.get('/:idUser/chats', chatsController.show);

// router.get('/:idUser/chatsName/:groupName', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, chatsController.show);
router.get('/:idUser/chats/:groupName', chatsController.get);

router.get('/:idUser/showallchats', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, chatsController.showAll);
// router.get('/:idUser/showallchats', chatsController.showAll);

router.post('/:idUser/chats', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, chatsController.create);
// router.post('/:idUser/chats', chatsController.create);

// router.put('/:idUser/:groupName/adduser', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, chatsController.create);
router.put('/:idUser/chats/:groupName/addUser', userAccessMiddleware.gotAccess, chatsController.addUser);

router.put('/:idUser/chats/:groupName/leaveChat', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, chatsController.leaveChat);
// router.put('/:idUser/chats/:groupName/leaveChat', chatsController.leaveChat);

router.delete('/:idUser/chats/:groupName', secureMiddleware.isAuthenticated, userAccessMiddleware.gotAccess, chatsController.deleteChat);
// router.delete('/:idUser/chats/:groupName', chatsController.deleteChat);

module.exports = router;