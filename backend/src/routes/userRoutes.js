const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js'); 

// User Route
router.get('/me', userController.getCurrentKeycloakUser);
router.get('/create', userController.createUserFromKeycloak);
router.get('/:userId', userController.getUserById);


router.patch('/:userId', userController.updateUser);






module.exports = router; 