const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommunitySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    description: {
        type: String,
        required: true,
    },

    members: {
        type: [ Schema.Types.ObjectId ],
        ref: 'User',
        default: [],
    },

    moderators: {
        type: [ Schema.Types.ObjectId ],
        ref: 'User',
        default: [],
    },

    imgURL: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

module.exports = mongoose.model('Community', CommunitySchema);
