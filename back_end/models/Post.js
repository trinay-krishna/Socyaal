const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    userId: Schema.Types.ObjectId,
    content: String,
    mediaType: String,
    mediaUrl: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Post', PostSchema);

