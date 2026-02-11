const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const auth = (req, res, next) => {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Extract Bearer <token>

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Middleware to verify Admin role
const admin = (req, res, next) => {
    // This assumes req.user is set by the auth middleware and contains role or ID to check
    // We'll need to fetch the full user from DB if role isn't in payload, 
    // but for simplicity let's assume the basic auth check is the priority first 
    // and we'll add role check in a moment after verifying the User model structure again.

    // For now, let's look at the User model again to see if role is in schema.
    // Yes, role is in User.js schema. We should include role in the JWT payload in auth.js signup/login.

    // Check if user is admin
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admins only' });
    }
};

module.exports = { auth, admin };
