const express = require('express');
const router = express.Router();
const checkAuthenticated = require('../authentication/checkAuthentication');

const communityController = require('../controllers/CommunityController');

router.post('/createCommunity',checkAuthenticated, communityController.create_community );

router.get('/get-popular-communities', checkAuthenticated, communityController.get_popular_communities);

router.post('/search-community', checkAuthenticated, communityController.search_community);

router.get('/join-community/:communityID', checkAuthenticated, communityController.join_community);

module.exports = router;

