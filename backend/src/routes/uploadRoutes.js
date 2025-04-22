const express = require("express");
const router = express.Router()
const uploadController = require("../controllers/uploadController.js");
const uploadMiddleware = require("../middleware/uploadService.js");


router.post("/send",uploadMiddleware.array('files'), uploadController.uploadFile); // Upload file

router.get("/getRecieved/:recipientId", uploadController.getRecipientUploads); // Get file by ID
router.get("/getAll/:uploaderId", uploadController.getUploaderUploads); // Get all uploads by uploader ID


module.exports = router;