
import jwt from "jsonwebtoken";
import User from "../MongoDB/Models/User.js";

const optionalAuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // No token: continue as a guest.
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user || user.banned) {
            req.user = null;
            return next();
        }

        req.user = {
            id: user._id.toString(),
            role: user.role
        };

        next();
    } catch (error) {
        // An invalid or expired token is treated as a guest
        // for this optional-authentication endpoint.
        req.user = null;
        next();
    }
};

export default optionalAuthMiddleware;
