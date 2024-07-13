const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const { comparePasswords } = require('../utils/passwordHash');

async function authUser(userName, userPass, done) {
    const user = await User.findOne({userName});

    if(!user) {
        return done(null, false);
    }

    if(!(await comparePasswords(userPass, user.userPass))) {
        return done(null, false);
    } else {
        return done(null, user);
    }

}

function passportSerialize() {
    passport.serializeUser( (user, done) => {
        done(null, user._id);
    } );
}

function passportDeserialize() {
    passport.deserializeUser( async (userID, done ) => {
        const user = await User.findOne({_id: userID});
        done(null, user);
    } );
}


function setupPassport() {
    passport.use(new LocalStrategy({usernameField: 'userName', passwordField: 'userPass'}, authUser));
    passportSerialize();
    passportDeserialize();
}

module.exports = setupPassport;





