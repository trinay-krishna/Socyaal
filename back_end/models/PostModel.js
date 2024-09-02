const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    media: [{
        mediaType: {
            type: String,
            enum: [ 'image', 'video' ],
            required: true,
        },
        mediaUrl: {
            type: String,
            required: true,
        },
    }],

    community: {
        type: Schema.Types.ObjectId,
        ref: 'Community',
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Post', PostSchema);

