const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    quizName: {
        type: String,
        required: true,
    },

    questions: [
        {
            questionText: {
                type: String,
                required: true,
            },
            
            options: {
                type: [ String ],
                required: true,
            },

            correctAnswer: {
                type: Number,
                required: true,
            },

            points: {
                type: Number,
                default: 10,
            }
        }
    ],

    startDate: {
        type: Date,
        required: true,
    },

    endDate: {
        type: Date,
        required: true,
    },

});

module.exports = mongoose.model('Quiz', quizSchema);