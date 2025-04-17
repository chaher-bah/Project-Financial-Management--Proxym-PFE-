const mongoose= require ("mongoose");
const userSchema = new mongoose.Schema({
    keyId: {
        type: String,
        required: true,
        unique: true,
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
        validate: {
            validator: function(v) {
                return /^\+(?:[0-9] ?){6,14}[0-9]$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }

    },
    photo: {
        type: Buffer,
        contentType: String,
    }
});

module.exports= mongoose.model("User", userSchema);
