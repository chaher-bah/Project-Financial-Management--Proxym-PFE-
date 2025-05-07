const express = require("express");
const router = express.Router()
const groupController = require("../controllers/groupController.js");

router.get("/", groupController.getAllGroups); // Get all groups    
router.post("/", groupController.createGroup); // Create a new group
router.put("/:id", groupController.updateGroup); // Update a group by ID
router.delete("/:id", groupController.deleteGroup); // Delete a group by ID



module.exports = router;