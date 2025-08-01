import jwt from 'jsonwebtoken'
import responseHandler from '../utils/responseHandler.js'

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const authToken = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null;

    if (!authToken) {
        return responseHandler(res, 401, "Authentication required please provide a token");
    }

    try {
        const decode = jwt.verify(authToken, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        return responseHandler(res, 401, "Invalid or expired token, please try again");
    }
}

export default authMiddleware