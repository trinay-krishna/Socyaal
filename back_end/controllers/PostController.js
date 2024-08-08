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
            const { title, content } = req.body;
            
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



