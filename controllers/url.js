const shortid = require("shortid");
const URL = require('../models/url');

async function handelGeneraterNewShortURL(req, res) {
    const body = req.body;
    console.log(body);
    if (!body.url) return res.status(400).json({ error: "url is required" });
    const shortId = shortid();
    console.log(shortId);
    await URL.create({
        shortid: shortId,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id,
    });
    return res.render("home", { id: shortId, });// server side rendering
}
async function handelGetAnalytics(req, res) {
    const shortid = req.params.shortId;
    const result = await URL.findOne({ shortid });
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports = {
    handelGeneraterNewShortURL,
    handelGetAnalytics,
}
