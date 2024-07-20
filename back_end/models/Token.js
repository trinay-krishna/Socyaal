const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        requird: true,
    },

    token: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Token', TokenSchema);
