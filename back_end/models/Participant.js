const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParticipantSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    userName: {
        type: String,
        required: true,
    },

    quizID: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },

    points: {
        type: Number,
        default: 0,
    },

    endDate: {
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model('Participant', ParticipantSchema);