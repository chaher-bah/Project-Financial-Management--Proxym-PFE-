const Upload = require("../models/upload");
const User = require("../models/user");

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

    //TO DO :SOLVE THE UPLOADERE ID/EMAIL

    // .map((recipient) => recipient._id);
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
