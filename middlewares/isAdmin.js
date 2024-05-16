const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
    const token = req.header('Authorization');

    try {
        const decodedToken = jwt.verify(token.split(' ')[1], process.env.JWT_KEY);
        if (decodedToken.role === "admin") {
            req.userId = decodedToken._id;
            next();
            return;
        }
    } catch (error) {
        // If there's an error or the user is not admin, send 401 Unauthorized
        return res.status(401).send('You are not authorized to access this resource.');
    }

    // If the user is not admin, send 401 Unauthorized
    return res.status(401).send('You are not authorized to access this resource.');
};

module.exports = isAdmin;
