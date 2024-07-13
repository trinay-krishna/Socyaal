const bcrypt = require('bcrypt');

const saltRounds = 10;

function generateSalt() {

    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if ( err ) {
                return reject(err);
            }
            resolve(salt);
        })
    });
}

async function hashPassword(userPass) {
    const salt = await generateSalt();

    return new Promise((resolve, reject) => {
        bcrypt.hash(userPass, salt, (err, hash) => {
            if(err) {
                return reject(err);
            }
            resolve(hash);
        })
    });
}

function comparePasswords(userPass, storedPass) {

    return new Promise((resolve, reject) => {
        bcrypt.compare(userPass, storedPass, (err, result) => {
            if ( err ) {
                return reject(err);
            }

            resolve(result);
        });
    });
}

module.exports = {hashPassword, comparePasswords};

