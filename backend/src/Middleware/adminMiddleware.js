import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.json({ success: false, message: "No token provided" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return res.json({ success: false, message: "Invalid token" });
    }
}

export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.json({ success: false, message: "Access denied" });
    }
    next();
}