const Post = require('../models/PostModel');
const { body, validationResult } = require('express-validator');
const upload = require('../utils/multer-config');
const {uploadToCloud, deleteFromCloud} = require('../utils/cloud-ops');
const clearLocalUploads = require('../utils/file-ops');
const classifyMediaType = require('../utils/classifyMediaType');


exports.create_post = [
    body('title')
    .trim(),
    body('content')
    .trim(),
    upload.fields([
        { name: 'postImages', maxCount: 15 }
    ]),
    async ( req, res, next ) => {
        try {
            const userID = req.session.passport.user;
            const { title, content, community } = req.body;
            
            const fileNames = req.files.postImages.map(element => element.path.replace(/^.*[\\/]/, ''));
            const filePaths = req.files.postImages.map(element => element.path);
            
            const links = await uploadToCloud(userID, filePaths);
            await clearLocalUploads(fileNames);

            const media = links.map(link => ({
                mediaType: classifyMediaType(link.original_extension || link.format),
                mediaUrl: link.secure_url,
            }));

            const post = new Post({
                userID,
                title,
                content,
                media,
                community,
            });


            console.log(post);
            await post.save();

            res.status(201).json({
                success: true,
                msg: 'Post successfully created!',
            });


        } catch ( err ) {
            console.error(err);
            const fileNames = req.files.postImages.map(element => element.path.replace(/^.*[\\/]/, ''));
            await clearLocalUploads(fileNames);
            res.status(500).json({
                success: false,
                msg: 'File too large.',
            });
        }
    }
];

exports.get_posts = async (req, res, next ) => {
    try {
        const page = req.params.page;
        const posts = await Post.find({})
                            .sort( { createdAt : -1 } )
                            .skip( 25 * page )
                            .limit(25);
        
        console.log(posts);
        res.status(200).json({
            success: true,
            msg: 'Posts Fetched!',
            posts,
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            msg: 'Error fetching posts',
        });
    }

}

exports.get_community_posts = async ( req, res, next ) => {
    try {
        const { page, community } = req.params;
        const MAX_POSTS_PER_PAGE = 25;

        const pageNumber = +page;

        const communityPageCount = await Post.countDocuments({ community });
        const totalPages = Math.ceil(communityPageCount/MAX_POSTS_PER_PAGE);

        let posts = [];

        if ( ( pageNumber + 1 ) <= totalPages ) {
            const communityPosts = await Post.find({ community })
                                    .sort( { createdAt: -1 } )
                                    .skip( MAX_POSTS_PER_PAGE * page )
                                    .limit(MAX_POSTS_PER_PAGE);
            posts = [ ...posts, ...communityPosts ];
        } 
        
        if ( ( pageNumber + 1 ) >= totalPages ) {
            const adjustedPageNumber = ( pageNumber + 1 ) - totalPages;
            const otherPosts = await Post.find( { community: { $ne: community } } )
                                    .sort( { createdAt: -1 } )
                                    .skip(MAX_POSTS_PER_PAGE * ( adjustedPageNumber ))
                                    .limit(MAX_POSTS_PER_PAGE); 
            
            posts = [ ...posts, ...otherPosts ];
        }

        console.log(posts);

        res.status(200).json({
            success: true,
            msg: 'Posts Fetched!',
            posts,
        });


    } catch(err) {
        console.error(err);
        req.status(500).json({
            success: false,
            msg: 'Error fetching posts',
        });
    }
}

