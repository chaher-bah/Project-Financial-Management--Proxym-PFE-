const mongoose = require("mongoose");

const fileSubSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  fileName:     { type: String, required: true },     
  path:         { type: String, required: true },      // e.g. "backend/Uploads/…"
  contentType:  { type: String, required: true },
  size:         { type: Number, required: true },
}, { _id: false });

const uploadSchema = new mongoose.Schema({
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }],
  dueDate: {
    type: Date,
    required: true,
  },
  files: {
    type: [fileSubSchema],
    validate: files => files.length > 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Upload", uploadSchema);
