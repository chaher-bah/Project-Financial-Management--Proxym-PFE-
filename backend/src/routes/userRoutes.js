const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js'); 

// User Route
router.get('/me', userController.getCurrentKeycloakUser);
router.post('/create', userController.createUserFromKeycloak);
router.get('/:userId', userController.getUserById);
router.get('/email/:email', userController.getUserByEmail);

router.get('/avatar/:email', userController.getUserPhoto);

router.patch('/:userId', userController.updateUser);

router.put('/sync', userController.syncUser);
router.patch('/avatar/:email', userController.updateUserPhoto);






module.exports = router; 