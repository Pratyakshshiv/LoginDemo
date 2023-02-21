const mongoose = require("mongoose")
const { Schema } = mongoose;
const UserDataSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model("user", UserDataSchema)