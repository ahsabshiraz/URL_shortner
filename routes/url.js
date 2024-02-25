const express = require('express');
const { handelGeneraterNewShortURL, handelGetAnalytics } = require('../controllers/url');

const router = express.Router();

router.post('/', handelGeneraterNewShortURL);
router.get('/analytics/:shortId',handelGetAnalytics);
module.exports = router;