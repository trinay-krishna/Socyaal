const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: ( req, file, cb ) => {
        cb(null, path.join(__dirname, '../', 'uploads'));
    },

    filename: ( req, file, cb ) => {
        const userID = req.session.passport.user;

        cb(null, `${userID}-${Date.now()}-${file.originalname}`);
    }
});

const upload = multer( { storage } );

module.exports = upload;

