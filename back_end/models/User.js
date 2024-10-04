const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    userPass: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    verified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now ,
    },
});

module.exports = mongoose.model('User', UserSchema);

