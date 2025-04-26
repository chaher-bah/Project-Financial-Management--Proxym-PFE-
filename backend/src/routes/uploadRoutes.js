const express = require("express");
const router = express.Router()
const uploadController = require("../controllers/uploadController.js");
const uploadMiddleware = require("../middleware/uploadService.js");


router.post("/send",uploadMiddleware.array('files'), uploadController.uploadFile); // Upload file
router.get("/:uploadId", uploadController.getUploadById); // Get upload by ID

router.get("/getRecieved/:recipientId", uploadController.getRecipientUploads); // Get recieved file by recipient ID
router.get("/getSent/:uploaderId", uploadController.getUploaderUploads); // Get send by uploader ID

router.get("/:status/:userId", uploadController.getUploadsByStatus); // Get all uploads by status

router.patch("/:status/:uploadId", uploadController.updateUploadStatus); // Update upload status

router.get("/download/:uploadId/:originalName", uploadController.downloadFile); // Download file by ID and filename

module.exports = router;