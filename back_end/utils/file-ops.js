const fs = require('fs/promises');
const path = require('path');

async function clearLocalUploads(fileNames) {
    try {
        await Promise.all(
            fileNames.map(fileName => fs.unlink(path.join(__dirname, '../','uploads', fileName)))
        );
    } catch(err) {
        console.error(`Error clearing local uplaods: ${err}`);
        throw err;
    }
}

module.exports = clearLocalUploads;

