const express = require("express");
const router = express.Router()
const roleController = require("../controllers/roleController.js");

router.get("/", roleController.getAllRoles); // Get all roles
router.get("/roleName/:id", roleController.getRoleNameById); // Get role name by ID

router.post("/new", roleController.AddRole); // Create a new role

router.delete("/:name", roleController.deleteRoleByName); // Delete a role by name
router.post('/roleNames', roleController.getRoleNames);

router.post('/user/role',roleController.addRoleToUser); // Get users by role

router.post('/user/rm/role',roleController.removeRoleFromUser); // Get users by role
module.exports = router;