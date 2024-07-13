const User = require('../models/User.js');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const { hashPassword, comparePasswords } = require('../utils/passwordHash.js');

exports.create_user = [
    body('userName')
    .trim()
    .isLength({min: 5})
    .withMessage('Username must atleast be 5 characters'),
    body('userPass')
    .trim()
    .isLength({min: 8})
    .withMessage('Password must atleast be 8 characters'),
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
    
            const { userName, userPass }  = req.body;
            const hashedPassword = await hashPassword(userPass);

            const user = new User({
                userName,
                userPass: hashedPassword,
            });

            await user.save();

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

                res.status(201).json({
                    success: true,
                    user,
                    msg: 'Login Successful',
                });
            })
        })(req, res, next);
    } catch(err) {
        console.log(err);
    }
}

