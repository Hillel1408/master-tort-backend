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
    avatar: { type: String },
    activationLinkEmail: { type: String },
    newEmail: { type: String },
    rushOrder: { type: Object },
});

module.exports = model('User', UserSchema);
