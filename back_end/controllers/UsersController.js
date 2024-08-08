const User = require('../models/User.js');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const { hashPassword, comparePasswords } = require('../utils/passwordHash.js');
const { generateLink, VERIFY, RESET_PASS } = require('../utils/generateLink.js');
const sendEmail = require('../utils/sendMail.js');
const Token = require('../models/Token.js');

exports.create_user = [
    body('userName')
    .trim()
    .isLength({min: 5})
    .withMessage('Username must atleast be 5 characters'),
    body('userPass')
    .trim()
    .isLength({min: 8})
    .withMessage('Password must atleast be 8 characters'),
    body('userEmail')
    .trim()
    .isEmail(),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if ( await User.findOne({userName: req.body.userName}) ) {
                errors.errors.push({
                    msg: 'Username already exists!',
                });
            }
            if(!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    errors: errors.errors,
                });
            }
    
            const { userName, userPass, userEmail }  = req.body;
            const hashedPassword = await hashPassword(userPass);

            const user = new User({
                userName,
                userPass: hashedPassword,
                userEmail,
            });

            await user.save();

            const link = await generateLink(user._id, VERIFY);
            sendEmail(userEmail, link);

            res.status(201).json({
                success: true,
                msg: `User ${userName} created Successfully`,
            });
        } catch(err) {
            console.log(err);
        }

    },
];

exports.login_user = async (req, res, next) => {
    try {
        passport.authenticate('local', (err, user) => {
            req.logIn(user, () => {
                if( err ) {
                    res.status(400).json({
                        success: false,
                        msg: 'Login Failed!',
                    });
                    throw new Error(err);
                }

                if( !user ) {
                    return res.status(400).json({
                        success: false,
                        msg: 'Username or password is incorrect!',
                    });
                }

                res.status(200).json({
                    success: true,
                    user,
                    msg: 'Login Successful',
                });
            })
        })(req, res, next);
    } catch(err) {
        console.error(err);
    }
}

exports.verify_user = async (req, res, next) => {
    try {
        const { userID, token } = req.params;

        const user = await User.findOne({_id: userID});
    
        if(!user) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid Link! User not found!',
            });
        }

        const tokenDoc = await Token.findOne({
            userID,
            token,
        });

        if (!tokenDoc) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid Link!',
            });
        }

        user.verified = true;
        await user.save();

        await Token.deleteOne({
            _id: tokenDoc._id
        });

        res.status(201).json({
            success: true,
            msg: 'User verified successfully!',
        });

    } catch(err) {
        console.log(err);
        res.status(400).json({
            success: false,
            msg: 'An error occured!',
        });
    }

}

exports.reset_pass_link = async (req, res, next) => {

    try {
        const { userName } = req.body;

        const user = await User.findOne({
            userName,
        });
    
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: 'Username not found!',
            });
        }
    
        const userEmail = user.userEmail;
    
        const link = await generateLink(user._id, RESET_PASS);
    
        sendEmail(userEmail, link);
    
        return res.status(201).json({
            success: true,
            msg: 'Reset-link sent!',
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            msg: 'An error occured!',
        });
        console.log(err);
    }
}

exports.reset_pass_post = [
    body('userPass')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must atleast be 8 characters'),
    body('confirmUserPass')
    .trim(),
    async (req, res, next) => {
        const { userID, token } = req.params;
        const { userPass, confirmUserPass } = req.body;

        if ( userPass !== confirmUserPass ) {
            return res.status(400).json({
                success: false,
                msg: 'Passwords do not match!',
            });
        }

        const user = await User.findOne({
            _id: userID,
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid Link! User not found!',
            });
        }

        const tokenDoc = await Token.findOne({
            userID,
            token,
        });

        if (!tokenDoc) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid Link!',
            });
        }

        const hashedPassword = await hashPassword(userPass);

        user.userPass = hashedPassword;
        await user.save();

        await Token.deleteOne({
            _id: tokenDoc._id,
        });

        res.status(201).json({
            success: true,
            msg: 'Password changed Successfully!',
        });
}
]

exports.reset_pass_get = async (req, res, next) => {

    try {
        const { userID, token } = req.params;

        const user = await User.findOne({
            _id: userID,
        });
    
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid Link! User not found!',
            });
        }
    
        const tokenDoc = await Token.findOne({
            userID,
            token,
        });
    
        if (!tokenDoc) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid Link!',
            });
        }
    
        res.status(200).json({
            success: true,
            msg: 'Link Valid!',
        });

    } catch(err) {
        res.status(500).json({
            success: false,
            msg: 'An error occured!',
        });
        console.log(err);
    }
}

