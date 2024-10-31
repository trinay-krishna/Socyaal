const cloudinary = require('./cloudinary-config');
const classifyMediaType = require('./classifyMediaType');
const path = require('path');

async function uploadToCloud(folderName, filePaths) {   
    try {
        const uploads = filePaths.map(filePath => {
            const extension = (path.extname(filePath).slice(1));
            const mediaType = classifyMediaType(extension);
            return (cloudinary.uploader.upload(filePath, {
                    resource_type: mediaType,
                    folder: `${folderName}`,
                }));
        });
        const links = await Promise.all(uploads);
    
        return links;
    } catch(err) {
        console.error(`Error uploading to cloud: ${err}`);
        throw err;
    }
}   

async function deleteFromCloud(publicID) {
    try {
        return (await cloudinary.uploader.destroy(publicID));
    } catch(err) {
        console.log('Error when deleting from cloud!');
        throw err;
    }
}

module.exports = {uploadToCloud, deleteFromCloud};