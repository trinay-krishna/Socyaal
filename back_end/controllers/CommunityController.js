const Community = require('../models/CommunityModel');
const CommunityMembers = require('../models/CommunityMembers');
const { body, validationResult } = require('express-validator');
const upload = require('../utils/multer-config');
const { uploadToCloud } = require('../utils/cloud-ops');
const clearLocalUploads = require('../utils/file-ops');
const { default: mongoose } = require('mongoose');

exports.create_community = [
    // body('communityName')
    // .trim()
    // .isLength( { min: 5 } )
    // .withMessage('Community name must atleast be 5 chararcters long'),
    // body('communityDescription')
    // .trim()
    // .isLength( { min: 5 } )
    // .withMessage('Community description must atleast be 5 chararcters long'),
    upload.single('communityImg'),
    async ( req, res, next ) => {

        try {

            const errors = validationResult(req);

            if ( !errors.isEmpty() ) {
                return res.status(400).json({
                    success: false,
                    errros: errors.errors,
                });
            }


            const { communityName, communityDescription } = req.body;

            if ( await Community.findOne({ name: communityName }) ) {
                return res.status(400).json({
                    success: false,
                    msg: 'Community already exists',
                });
            }

            const fileName = req.file.path.replace(/^.*[\\/]/, '');
            const filePath = req.file.path;

            const link = await uploadToCloud(communityName, [ filePath ]);
            await clearLocalUploads([ fileName ]);

            const imgURL = link[0].secure_url;


            const userID = req.session.passport.user;

            const community = new Community({
                name: communityName,
                description: communityDescription,
                imgURL,
                createdBy: userID,
            });

            console.log(community);

            await community.save();

            const communityMember = new CommunityMembers({ communityID: community._id, userID, role: 'Admin' });
            await communityMember.save();

            res.status(201).json({
                success: true,
                msg: 'Community created!',
            });

        } catch ( err ) {
            console.error(err);
            res.status(500).json({
                success: false,
                msg: 'Error',
                error: err,
            });
        }
    }
];

exports.get_popular_communities = async ( req, res, next ) => {
    try {

        const popularCommunities = await Community.find( { } )
                                        .sort( { members: -1 } )
                                        .limit(5);
        

        res.status(200).json({
            success: true,
            communities: popularCommunities,
            msg: 'Fetched Communities successfully!',
        });

    } catch ( err ) {
        console.error(err);
        res.status(500).json({
            success : false,
            msg: 'Error',
            error: err,
        });
    }
}

exports.get_user_communities = async ( req, res, next ) => {
    try {
        const userID = req.session.passport.user;

        const communities = await CommunityMembers.aggregate()
        .match( { userID: mongoose.Types.ObjectId.createFromHexString(userID) } )
        .project( { _id: false, userID: false, } )
        .lookup({
            from: 'communities',
            localField: 'communityID',
            foreignField: '_id',
            as: 'communityName',
            pipeline: [
                {
                    $project: {
                        'name': true,
                        '_id': false,
                    }
                }
            ]
        })



        res.status(200).json({
            success: true,
            communities,
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            msg: 'Error',
        });
    }
}

exports.search_community = async ( req, res, next ) => {
    try {

        const searchQuery = req.body.searchQuery.trim();

        const queriedCommunity = await Community.aggregate()
                                                .search({
                                                    text: {
                                                        query: searchQuery,
                                                        path: {
                                                            wildcard: '*',
                                                        },
                                                        fuzzy: {},
                                                    }
                                                });
        

        res.status(200).json({
            success: true,
            msg: 'Queried Successfully',
            queryResult: queriedCommunity,
        });

    } catch( err ) {
        console.log(err);
        res.status(500).json({
            success: false,
            msg: 'Error',
            error: err,
        });
    }
}

exports.join_community = async ( req, res, next ) => {
    try {

        const communityID = req.params.communityID;
        const userID = req.session.passport.user;

        const isPresent = ( await CommunityMembers.findOne( { communityID, userID } ) ) != null;

        if ( isPresent ) {
            return res.status(200).json({
                success: false,
                signal: 0,
                msg: 'User already in community!',
            });
        }

        const member = new CommunityMembers({
            userID,
            communityID,
        });

        await member.save();

        return res.status(201).json({
            success: true,
            msg: 'Community Joined!',
        });

    } catch( err ) {
        console.error(err);
        res.status(500).json({
            success: false,
            msg: 'Error',
            error: err,
        });
    }
}

exports.leave_community = async ( req, res, next ) => {
    try {
        const communityID = req.params.communityID;
        const userID = req.session.passport.user;

        await CommunityMembers.deleteOne( { userID, communityID } );

        res.status(200).json({
            success: true,
            msg: 'User left community',
        });
    } catch(err) {
        console.error(err);

        res.status(500).json({
            success: false,
            msg: 'Error',
        });
    }
}



