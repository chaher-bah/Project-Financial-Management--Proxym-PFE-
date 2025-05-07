const mongoose = require('mongoose');


const variantSubSchema = new mongoose.Schema({
    name: {type: String, required: true},
    tarif: {type: Number},
}, { _id: false });

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    special:{
        type: Boolean,
        default: false,
    },
    variants: {
        type:[variantSubSchema],
    }
});

module.exports = mongoose.model('Group', groupSchema);