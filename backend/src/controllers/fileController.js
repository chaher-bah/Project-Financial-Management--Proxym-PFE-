const Upload = require("../models/upload");
const User = require("../models/user");
const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');
const validStatuses = [
  "Envoyee",
  "EnAttente",
  "Consultee",
  "Approuvee",
  "Refuse",
];

//patch file status
exports.updateFileStatus = async (req, res) => {
  try {
    const { uploadId, fileName, newStatus } = req.params;
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
    // Find the file in the upload
    const file = upload.files.find((f) => f.originalName === fileName);
    if (!file) {
      return res.status(404).json({ message: "File not found in upload" });
    }
    // Update the status of the file
    file.fileStatus = newStatus;
    await upload.save();

    res
      .status(200)
      .json({ message: "File status updated successfully", upload });
  } catch (error) {
    console.error("Error updating file status:", error);
    res
      .status(500)
      .json({ message: "Error updating file status", error: error.message });
  }
};

//save file feedback
exports.saveFileFeedback = async (req, res) => {
  const { uploadId, fileName } = req.params;
  const { feedbackText, authorId, firstName, familyName } = req.body;
  console.log(req.params);
  if (!feedbackText || !authorId) {
    return res
      .status(400)
      .json({ message: "Feedback text and author ID are required" });
  }
  //find the upload
  const upload = await Upload.findById(uploadId);
  if (!upload) {
    return res.status(404).json({ message: "Upload not found" });
  }
  //find the file
  const file = upload.files.find((f) => f.originalName === fileName);
  if (!file) {
    return res.status(404).json({ message: "File not found in upload" });
  }
  //create feedback object
  const feedback = {
    user: {
      id: authorId,
      firstName: firstName,
      familyName: familyName,
    },
    feedbackDate: new Date(),
    feedbackText: feedbackText,
  };
  //add feedback to the file
  file.feedback.push(feedback);
  file.fileStatus = "Consultee"; 
    
  //save the upload
  await upload.save();
  res.status(200).json({ message: "Feedback saved successfully", upload });
};

// save new file version
// exports.saveNewFileVersion = async (req, res) => {
//     const { uploadId, fileName } = req.params;
//     const { authorId } = req.body;
//     const newFile=req.file;
//     if (!authorId) {
//       return res.status(400).json({ message: "Author ID is required" });
//     }
//     try{
//     //find the upload
//     const upload = await Upload.findById(uploadId);
//     if (!upload) {
//       return res.status(404).json({ message: "Upload not found" });
//     }
//     //find the file
//     const file = upload.files.find((f) => f.originalName === fileName);
//     if (!file) {
//       return res.status(404).json({ message: "File not found in upload" });
//     }
//      // Get user info for versioning
//      const user = await User.findById(authorId);
//      if (!user) {
//          return res.status(404).json({ message: "User not found" });
//      }
//     //save the new file version
//     file.versions.push({
//         originalName: newFile.originalName,
//         fileName: newFile.fileName,
//         size: newFile.size,
//         path: newFile.path,
//         contentType: newFile.contentType,
//         uploadedBy: authorId,
//         uploadDate: newFile.uploadDate,
//     })
//     //update the file
//     // file.push({
//     //   fileStatus:"Consultee",
//     //   uploadDate: new Date(),
//     // });

//     await upload.save();
//     res.status(200).json({ message: "File version saved successfully", upload });
//   }catch (error) {
//     console.error("Error saving new file version:", error);
//     res.status(500).json({ message: "Error saving new file version", error: error.message });
//   }
// }


exports.saveNewFileVersion = async (req, res) => {
  const { uploadId, fileName } = req.params;
  // Expect firstName and familyName to be provided in the request body (or you can pull them from the token)
  const { authorId, firstName, familyName } = req.body;
  // req.file will be processed by our versioning multer middleware (see below)
  const newFile = req.file;

  if (!authorId || !newFile) {
    return res
      .status(400)
      .json({ message: "Author ID and file are required" });
  }

  try {
    // Find the upload document by its ID
    const upload = await Upload.findById(uploadId);
    if (!upload)
      return res.status(404).json({ message: "Upload not found" });

    // Find the file entry in the upload (the file that remains unchanged)
    const fileEntry = upload.files.find(f => f.originalName === fileName);
    if (!fileEntry)
      return res.status(404).json({ message: "File not found in upload" });

    // Optionally verify that the user exists... (if needed)
    const user = await User.findById(authorId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Build the version entry.
    // Here, newFile.filename should have already been renamed by Multer.
    fileEntry.versions.push({
      originalName: newFile.originalname, // Keep the original base name as reference
      fileName: newFile.filename, // the new templated filename
      size: newFile.size,
      path: newFile.path,
      contentType: newFile.mimetype,
      uploadedBy: {
        id: authorId,
        firstName: firstName,
        familyName: familyName,
      },
      uploadDate: new Date(),
      baseFileName: fileEntry.originalName, // Keep the original base name as reference
    });

    // Update the live file status and update date to indicate it has been modified
    fileEntry.fileStatus = "Consultee";
    fileEntry.uploadDate = new Date();

    // Save the updated upload document
    await upload.save();

    return res.status(200).json({
      message: "File version saved successfully",
      upload,
    });
  } catch (error) {
    console.error("Error saving new file version:", error);
    return res.status(500).json({
      message: "Error saving new file version",
      error: error.message,
    });
  }
};

//delete file
exports.deleteFile = async (req, res) => {
  try {
    const { uploadId, fileName } = req.params;
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
    const fileIndex = upload.files.findIndex((f) => f.originalName === fileName);
    if (fileIndex === -1) {
      return res.status(404).json({ message: "File not found in upload" });
    }
    
    const file = upload.files[fileIndex];
    
    // Delete the local file
    // try {
    //   if (fs.existsSync(file.path)) {
    //     fs.unlinkSync(file.path);
    //   }
      
    //   // Also delete any version files if they exist
    //   if (file.versions && file.versions.length > 0) {
    //     for (const version of file.versions) {
    //       if (version.path && fs.existsSync(version.path)) {
    //         fs.unlinkSync(version.path);
    //       }
    //     }
    //   }
    // } catch (fsError) {
    //   console.error("Error deleting file from filesystem:", fsError);
    //   // Continue with the database operation even if file deletion fails
    // }
    
    // Remove the file from the upload
    upload.files.splice(fileIndex, 1);
    
    if (upload.files.length === 0) {
      // If no files left, delete the entire upload
      await Upload.findByIdAndDelete(uploadId);
      return res.status(200).json({ message: "File and upload deleted successfully as it was the last file" });
    } else {
      // Otherwise save the upload with the file removed
      await upload.save();
      return res.status(200).json({ message: "File deleted successfully", upload });
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Error deleting file", error: error.message });
  }
}

//download file
exports.downloadFile = async (req, res) => {
  try {
    const { uploadId, originalName, userId } = req.params;
    
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
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${file.originalName}`
    );
    res.setHeader("Content-Type", file.contentType);
    res.setHeader("Content-Length", file.size);
    
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if the user has already downloaded this file
    const alreadyDownloaded = file.downloadedBy.some(
      download => download.user.id.toString() === userId
    );
    
    // If user has already downloaded, update the date; otherwise add a new entry
    if (alreadyDownloaded) {
      // Find the index of the existing download entry for this user
      const downloadIndex = file.downloadedBy.findIndex(
        download => download.user.id.toString() === userId
      );
      if (downloadIndex !== -1) {
        // Update just the download date
        file.downloadedBy[downloadIndex].downloadDate = new Date();
      }
    } else {
      // Add new download entry
      file.downloadedBy.push({
        user: {
          id: user._id,
          firstName: user.firstName,
          familyName: user.familyName
        },
        downloadDate: new Date()
      });
    }

    // Check if all recipients have downloaded this file
    const allRecipients = upload.recipients.map(recipient => recipient.toString());
    const downloadedUserIds = file.downloadedBy.map(d => d.user.id.toString());
    const allDownloaded = allRecipients.every(recipientId => 
      downloadedUserIds.includes(recipientId)
    );

    // Update file status based on download status
    if (allDownloaded) {
      file.fileStatus = 'EnAttente';
    } else {
      file.fileStatus = 'Envoyee';
    }

    // Save changes to the upload document
    await upload.save();
    // Send the file
    res.download(file.path, file.originalName, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ message: "Error downloading file" });
      }
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    res
      .status(500)
      .json({ message: "Error downloading file", error: error.message });
  }
};

//download file version
exports.downloadFileVersion = async (req, res) => {
  try {
    const { uploadId, fileName, versionFileName } = req.params;
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
    const file = upload.files.find((f) => f.originalName === fileName);
    if (!file) {
      return res.status(404).json({ message: "File not found in upload" });
    }
    // Find the version in the file
    const version = file.versions.find((v) => v.originalName === versionFileName && v.baseFileName === fileName); ;
    if (!version) {
      return res.status(404).json({ message: "Version not found in file" });
    }
    
    // Set headers for file download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${version.fileName}`
    );
    res.setHeader("Content-Type", version.contentType);
    res.setHeader("Content-Length", version.size);
    
    // Send the file
    res.download(version.path, version.fileName, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ message: "Error downloading file" });
      }
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    res
      .status(500)
      .json({ message: "Error downloading file", error: error.message });
  }
};