const mongoose= require ("mongoose");
const userSchema = new mongoose.Schema({
    keyId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match:[/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    phone: {
        type: String,
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    role: {
        type: [String], 
    },
});

module.exports= mongoose.model("User", userSchema);
