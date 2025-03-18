const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    console.log(req.cookies);
    try {
        const token = req.cookies?.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);

        if (!token) {
            return res.status(401).json({ error: "Not authorized, token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

const authenticateRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.userRole !== requiredRole) {
            return res.status(403).json({ error: "Access denied! Insufficient clearance." });
        }
        next();
    };
};

module.exports = { authenticateUser, authenticateRole };
