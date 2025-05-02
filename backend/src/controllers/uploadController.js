const Upload = require("../models/upload");
const User = require("../models/user");
const mongoose = require("mongoose");
const validStatuses = [
  "Envoyee",
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
    const toPmo = req.body.toPmo; // Expecting a boolean value
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
      toPmo: toPmo,
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


//upadae the upload status and the files status
exports.updateStatus = async (req, res) => {
  try {
    const { uploadId, newStatus } = req.params;
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(uploadId)) {
      return res.status(400).json({ message: "Invalid upload ID format" });
    }
    // Check if upload exists
    const upload = await Upload.findById(uploadId).exec();
    if (!upload) {
      return res.status(404).json({ message: "Upload not found" });
    }
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    // Update the status of the upload
    upload.status = newStatus;
    // Update the status of all files in the upload
    upload.files.forEach((file) => {
      file.fileStatus = newStatus;
    });
    if (newStatus === "Envoyee") {
      upload.files.forEach((file) => {
        file.downloadedBy = [];
        file.feedback = [];
        file.versions = [];
        
      });
    }

    await upload.save();
    res
      .status(200)
      .json({ message: "Upload and file statuses updated successfully", upload });
  } catch (error) {
    console.error("Error updating upload and file statuses:", error);
    res
    .status(500).json({
      message: "Error updating upload and file statuses",
      error: error.message,
    });
  }
};

//get uploads by user ID
exports.getUploadsByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const uid =new mongoose.Types.ObjectId(userId);

    const pipeline = [
      // only docs where this user is uploader OR a recipient
      { $match: { $or: [ { uploader: uid }, { recipients: uid } ] } },

      // add isUploader flag
      {
        $lookup: {
          from:      "users",
          localField: "uploader",
          foreignField: "_id",
          as:        "uploaderDoc"
        }
      },
      { $unwind: "$uploaderDoc" }, 
      {
        $lookup: {
          from:      "users",
          localField: "recipients",
          foreignField: "_id",
          as:        "recipientDocs"
        }
      },        
      { $addFields: { isUploader: { $eq: ["$uploader", uid] } } },

      // project only the fields you care about
      { $project: {
        uploader: {
          _id :"$uploaderDoc._id",
          firstName:   "$uploaderDoc.firstName",
          familyName:  "$uploaderDoc.familyName",
          email:       "$uploaderDoc.email"
        },
        recipients: {
          $map: {
            input: "$recipientDocs",
            as:    "r",
            in: {
              firstName:  "$$r.firstName",
              familyName: "$$r.familyName",
              email:      "$$r.email"
            }
          }
        },
          dueDate:    1,
          status:     1,
          comnts:     1,
          createdAt:  1,
          updatedAt:  1,
          files:      1,
          isUploader: 1,
          toPmo:     1,
      }},

      // group into buckets by status
      { $group: {
          _id:     "$status",
          uploads: { $push: "$$ROOT" }
      }},

      // rename _id → status
      { $project: {
          _id:    0,
          status: "$_id",
          uploads: 1
      }},

      // sort the buckets in your enum order
      { $addFields: {
          sortOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$status","Envoyee"] },  then: 0 },
                { case: { $eq: ["$status","AReviser"] },  then: 1 },
                { case: { $eq: ["$status","EnAttente"] }, then: 2 },
                { case: { $eq: ["$status","Consultee"] }, then: 3 },
                { case: { $eq: ["$status","Approuvee"] }, then: 4 },
                { case: { $eq: ["$status","Refuse"] },    then: 5 }
              ],
              default: 99
            }
          }
      }},
      { $sort: { sortOrder: 1 } },
      { $project: { sortOrder: 0 }}
    ];

    const grouped = await Upload.aggregate(pipeline).exec();
    res.json(grouped);
  }
  catch (err) {
    next(err);
  }
};







