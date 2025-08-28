const jwt = require("jsonwebtoken");
const config = require("../../config");

const JWT_SECRET = config.jwt.secret;

function verifyToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access token missing",
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // attach decoded token to the request
        next();
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}

module.exports = verifyToken;
