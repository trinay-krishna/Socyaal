const Token = require('../models/Token');
const crypto = import('crypto');

const VERIFY = 'verify';
const RESET_PASS = 'reset-pass';

async function generateToken(userID) {

    const token = (await crypto).randomBytes(32).toString('hex');
    const newToken = new Token({
        userID,
        token,
    });

    await newToken.save();

    return(token);

}

async function generateLink(userID, action) {
    const token = await generateToken(userID);
    
    const link = `${process.env.BASEURL}/users/${action}/${userID}/${token}`;

    return(link);
}

module.exports = { generateLink, VERIFY, RESET_PASS };





