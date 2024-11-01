const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communityMembersModel = new Schema({
    communityID: {
        type: Schema.Types.ObjectId,
        ref: 'Community',
        required: true,
    },

    userID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },

    role: {
        type: String,
        default: 'Member',
    },

});

module.exports = mongoose.model('CommunityMembers', communityMembersModel);

