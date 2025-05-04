const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); 




//Admin Route 
router.get('/key/all', adminController.getKeycloakUsers); 

router.get('/users', adminController.getAllUsers);

router.delete('/:userId', adminController.deleteUser);
router.get('/key/roles', adminController.getKeycloakRealmRoles); // Get all roles from Keycloak
router.post('/key/new/roles',adminController.addKeycloakRealmRole)
module.exports = router;
