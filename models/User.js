const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    title: {type: String },
    company: {type:String },
    phone: {type: String },
    location: {type: String },
    avatar: { type: String },
});

module.exports = mongoose.model('User', UserSchema);
