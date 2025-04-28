const mongoose = require("mongoose");
const statusEnum = ['Envoyee', 'EnAttente', 'Consultee', 'Approuvee', 'Refuse'];

const fileSubSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  fileName:     { type: String, required: true },     
  path:         { type: String, required: true },      // e.g. "backend/Uploads/…"
  contentType:  { type: String, required: true },
  size:         { type: Number, required: true },
  fileStatus: { type: String, enum: statusEnum, default: "Envoyee" },
  downloadedBy:[{
    user:{
      id:{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
      firstName: { type: String, required: true },
      familyName: { type: String, required: true },
    },
    downloadDate: { type: Date, default: Date.now },
  }]
  
}, { _id: false });
const downloadSubSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }],
  downloadDate: { type: Date, default: Date.now },

}, { _id: false});
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
  downloaded:{type: [downloadSubSchema],default: []},
  comnts: {
    type: String,
    default: "",
  },
}, {
  timestamps: true,
});

function unique(arr) {
  return Array.from(new Set(arr));
}

uploadSchema.pre('save', function(next) {
  // collect all fileStatus values
  const statuses = this.files.map(f => f.fileStatus);
  const uniq = unique(statuses);

  // if there is exactly one unique status, set the parent
  if (uniq.length === 1) {
    this.status = uniq[0];
  }
  // otherwise you could choose to set a mixed/aggregate status,
  // or leave this.status as-is
  next();
});

module.exports = mongoose.model("Upload", uploadSchema);
