const Upload = require("../models/upload");
const User = require("../models/user");
const mongoose = require("mongoose");
const validStatuses = [
  "Envoyee",
  "AReviser",
  "EnAttente",
  "Consultee",
  "Approuvee",
  "Refuse",
];

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
//get upload by id
exports.getUploadById = async (req, res) => {
  try {
    const { uploadId } = req.params;
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(uploadId)) {
      return res.status(400).json({ message: "Invalid upload ID format" });
    }
    // Check if upload exists
    const upload = await Upload.findById(uploadId)
      .populate("recipients", "firstName familyName email role")
      .populate("uploader", "firstName familyName email role")
      .exec();
    if (!upload) {
      return res.status(404).json({ message: "Upload not found" });
    }
    res.status(200).json({ message: "Upload fetched successfully", upload });
  } catch (error) {
    console.error("Error fetching upload:", error);
    res
      .status(500)
      .json({ message: "Error fetching upload", error: error.message });
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
      uploads,
    });
  } catch (error) {
    console.error("Error fetching uploads:", error);
    res
      .status(500)
      .json({ message: "Error fetching uploads", error: error.message });
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
      uploads,
    });
  } catch (error) {
    console.error("Error fetching uploads:", error);
    res
      .status(500)
      .json({ message: "Error fetching uploads", error: error.message });
  }
};
//get ulpoads by status and userId(uploader or recipient)
exports.getUploadsByStatus = async (req, res) => {
  try {
    const { userId, status } = req.params;
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Get all uploads for this user (both as uploader and recipient)
    const uploaderUploads = await Upload.find({
      uploader: userId,
      status: status,
    })
      .populate("recipients", "firstName familyName email role")
      .populate("uploader", "firstName familyName email role")
      .exec();

    const recipientUploads = await Upload.find({
      recipients: userId,
      status: status,
    })
      .populate("recipients", "firstName familyName email role")
      .populate("uploader", "firstName familyName email role")
      .exec();

    // Combine the results (you could add a flag to distinguish them if needed)
    const allUploads = {
      asUploader: uploaderUploads,
      asRecipient: recipientUploads,
    };

    const totalCount = uploaderUploads.length + recipientUploads.length;

    if (totalCount === 0) {
      return res.status(404).json({
        message: `No uploads with status '${status}' found for this user`,
      });
    }

    res.status(200).json({
      message: "Uploads fetched successfully (by status)",
      totalCount: totalCount,
      uploaderCount: uploaderUploads.length,
      recipientCount: recipientUploads.length,
      uploads: allUploads,
    });
  } catch (error) {
    console.error("Error fetching uploads:", error);
    res
      .status(500)
      .json({ message: "Error fetching uploads", error: error.message });
  }
};

//patch upload status
exports.updateUploadStatus = async (req, res) => {
  try {
    const { status, uploadId } = req.params;
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(uploadId)) {
      return res.status(400).json({ message: "Invalid upload ID format" });
    }
    // Check if upload exists
    const upload = await Upload.findById(uploadId)
      .populate("recipients", "firstName familyName email role")
      .populate("uploader", "firstName familyName email role")
      .exec();
    if (!upload) {
      return res.status(404).json({ message: "Upload not found" });
    }
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    // Update the status of the upload
    upload.status = status;
    await upload.save();

    res
      .status(200)
      .json({ message: "Upload status updated successfully", upload });
  } catch (error) {
    console.error("Error updating upload status:", error);
    res
      .status(500)
      .json({ message: "Error updating upload status", error: error.message });
  }
};

//download file
exports.downloadFile = async (req, res) => {
  try {
    const { uploadId,originalName } = req.params;
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(uploadId)) {
      return res.status(400).json({ message: "Invalid upload ID format" });
    }
    // Check if upload exists
    const upload = await Upload.findById(uploadId).exec();
    if (!upload) {
      return res.status(404).json({ message: "Upload not found" });
    }
    // Find the file in the upload
    const file = upload.files.find((f) => f.originalName === originalName);
    if (!file) {
      return res.status(404).json({ message: "File not found in upload" });
    }
    // Set headers for file download
    res.setHeader("Content-Disposition", `attachment; filename=${file.originalName}`);
    res.setHeader("Content-Type", file.contentType);
    res.setHeader("Content-Length", file.size);
    // Send the file
    res.download(file.path, file.originalName, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ message: "Error downloading file" });
      }
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ message: "Error downloading file", error: error.message });
  }
    
};
