
function checkAuthenticated(req, res, next) {
    if( req.isAuthenticated() ) {
        return next();
    }

    res.status(400).json({
        success: 'false',
        msg: 'Unauthorized',
    });
}

module.exports = checkAuthenticated;

