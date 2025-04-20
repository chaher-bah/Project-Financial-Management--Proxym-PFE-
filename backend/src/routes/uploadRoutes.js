const express = require("express");
const router = express.Router()
const uploadController = require("../controllers/uploadController.js");
const uploadMiddleware = require("../middleware/uploadService.js");


router.post("/send",uploadMiddleware.array('files'), uploadController.uploadFile); // Upload file






module.exports = router;