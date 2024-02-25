const { getUser } = require('../service/auth');

function checkForAuthentication(req, res, next) //Authentication
{
    const tokenCookie = req.cookies?.token;
    req.user = null;

    if (!tokenCookie) return next();

    const token = tokenCookie;
    const user = getUser(token);

    req.user = user;
    next();
}
function restrictTo(role = [])//Authorization
{
    return function (req, res, next) {
        if (!req.user) return res.redirect("/login");//checkForAuthentication(MW)is inserting the user in req
        if (!role.includes(req.user.role)) return res.end("UnAuthorized");// user model changed we added role in the model
        return next();
    };
}

module.exports = {
    checkForAuthentication,
    restrictTo,
}