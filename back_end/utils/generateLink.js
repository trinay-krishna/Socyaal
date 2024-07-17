const Token = require('../models/Token');
const crypto = import('crypto');

async function generateToken(userID) {

    const token = (await crypto).randomBytes(32).toString('hex');
    const newToken = new Token({
        userID,
        token,
    });

    await newToken.save();

    return(token);

}

async function generateLink(userID) {
    const token = await generateToken(userID);
    
    const link = `${process.env.BASEURL}/users/verify/${userID}/${token}`;

    return(link);
}

module.exports = generateLink;





