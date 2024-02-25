const jwt = require('jsonwebtoken');
const secret = "Piyush$123@$";

function setUser(user) {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            role: user.role,
        }, secret);// creates a token for ur user/(payload)
}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }

}
module.exports = {
    setUser,
    getUser,
}