const mongoose = require("mongoose");
const statusEnum = ['Envoyee', 'AReviser', 'EnAttente', 'Consultee', 'Approuvee', 'Refuse'];

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
  status: {
    type: String,
    enum: statusEnum,
    default: "Envoyee",
  },
  comnts: {
    type: String,
    default: "",
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Upload", uploadSchema);
