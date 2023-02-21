const mongoose = require("mongoose")
const { Schema } = mongoose;
const OtpSchema = new Schema({
    email: String,
    code: String,
    expireIn: Number
}, {
    timestamps: true
})

module.exports = mongoose.model("otp", OtpSchema)