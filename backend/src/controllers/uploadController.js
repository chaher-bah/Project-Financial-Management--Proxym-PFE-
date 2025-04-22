const Upload = require("../models/upload");
const User = require("../models/user");
const mongoose = require("mongoose");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    let recipients = req.body.recipients; // Expecting an array of recipient IDs
    // Convert stringified array to actual array
    if (typeof recipients === "string") {
      try {
        recipients = JSON.parse(recipients.replace(/'/g, '"'));
      } catch (parseError) {
        return res.status(400).json({
          message: "Invalid recipients format. Use valid JSON array syntax",
          parseError: parseError.message,
        });
      }
    }

    const dueDate = req.body.dueDate;
    const uploader = req.body.uploader; // Expecting the uploader ID
    if (!dueDate || !recipients || !uploader) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const comnts = req.body.comments;
    // Validate recipients exist
    const existingRecipients = await User.find({
      _id: { $in: recipients },
    });
    if (existingRecipients.length !== recipients.length) {
      return res.status(400).json({ message: "Some recipients do not exist" });
    }
    // Save files and recipients to the database
    const files = req.files.map((file) => ({
      originalName: file.originalname,
      fileName: file.filename,
      path: file.path,
      contentType: file.mimetype,
      size: file.size,
    }));
    const upload = new Upload({
      uploader: uploader,
      recipients: recipients,
      dueDate: new Date(dueDate),
      files: files,
      comnts: comnts,
    });

    await upload.save();
    res.status(201).json({ message: "Files uploaded successfully", upload });
  } catch (error) {
    console.error("Error uploading files:", error);
    res
      .status(500)
      .json({ message: "Error uploading files", error: error.message });
  }
};
// Get all uploads for a specific uploader
exports.getUploaderUploads = async (req, res) => {
  try {
    const { uploaderId } = req.params;
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(uploaderId)) {
      return res.status(400).json({ message: "Invalid uploader ID format" });

    }
    // Check if uploader exists
    const uploader = await User.findById(uploaderId);
    if (!uploader) {
      return res.status(404).json({ message: "Uploader not found" });
    }
    
    const uploads = await Upload.find({ uploader: uploaderId })
      .populate("recipients", "firstName familyName email")
      .populate("uploader", "firstName familyName email")
      .exec();
    
    res.status(200).json({ 
      message: "Uploads fetched successfully", 
      count: uploads.length,
      uploads 
    });
  } catch (error) {
    console.error("Error fetching uploads:", error);
    res.status(500).json({ message: "Error fetching uploads", error: error.message });
  }
};
// get  uploads for a specific recipient 
exports.getRecipientUploads = async (req, res) => {
  try {
    const { recipientId } = req.params;
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ message: "Invalid recipient ID format" });
    }
    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }
    
    const uploads = await Upload.find({ recipients: recipientId })
      .populate("recipients", "firstName familyName email")
      .populate("uploader", "firstName familyName email")
      .exec();
    
    res.status(200).json({ 
      message: "Uploads fetched successfully (recipient)", 
      count: uploads.length,
      uploads 
    });
  } catch (error) {
    console.error("Error fetching uploads:", error);
    res.status(500).json({ message: "Error fetching uploads", error: error.message });
  }
}
