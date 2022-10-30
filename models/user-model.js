const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    fullName: { type: String, required: true },
    city: { type: String, required: true },
    activationLinkPassword: { type: String },
    newPassword: { type: String },
});

module.exports = model('User', UserSchema);
