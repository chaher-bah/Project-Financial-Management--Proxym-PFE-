const express = require("express");
const router = express.Router()
const uploadController = require("../controllers/uploadController.js");

const fileController = require("../controllers/fileController.js");
const {upload,uploadVersion} =require( "../middleware/uploadService.js")


router.post("/send",upload.array('files'), uploadController.uploadFile); // Upload files
router.get("/:uploadId", uploadController.getUploadById); // Get upload by ID


router.get("/getAll/:userId", uploadController.getUploadsByUser); // Get all uploads

router.get("/getRecieved/:recipientId", uploadController.getRecipientUploads); // Get recieved file by recipient ID
router.get("/getSent/:uploaderId", uploadController.getUploaderUploads); // Get send by uploader ID

router.get("/:status/:userId", uploadController.getUploadsByStatus); // Get all uploads by status

router.patch("/update/:uploadId/:newStatus", uploadController.updateStatus); // Update upload by ID

router.patch("/:status/:uploadId", uploadController.updateUploadStatus); // Update upload status

router.patch("/file/:uploadId/:fileName/:newStatus", fileController.updateFileStatus); // Update file status by ID

router.post("/:uploadId/files/:fileName/feedback",upload.none(), fileController.saveFileFeedback); // Save file feedback


router.post("/:uploadId/files/:fileName/modify",uploadVersion.single('newFile'), fileController.saveNewFileVersion);

router.delete("/:uploadId/files/:fileName/delete", fileController.deleteFile); // Delete upload by ID

router.get("/download/:uploadId/:originalName/:userId", fileController.downloadFile); // Download file by ID and filename
router.get("/download/:uploadId/:fileName/versions/:versionFileName", fileController.downloadFileVersion); // Download file by ID and filename

module.exports = router;