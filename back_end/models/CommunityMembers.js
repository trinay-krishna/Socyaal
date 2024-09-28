const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communityMembersModel = new Schema({
    communityID: {
        type: Schema.Types.ObjectId,
        ref: 'Community',
    },

    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

module.exports = mongoose.model('CommunityMembers', communityMembersModel);

