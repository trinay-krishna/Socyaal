

function classifyMediaType(extname) {

    const imageExtensions = ['jpeg', 'jpg', 'png', 'bmp', 'heic', 'gif', 'webp'];
    const videoExtensions = ['mp4', 'mov', 'avi'];

    if(imageExtensions.includes(extname)) {
        return 'image';
    }

    if(videoExtensions.includes(extname)) {
        return 'video';
    }

    else {
        throw new Error('Unsupported file extension!');
    }
}

module.exports = classifyMediaType;