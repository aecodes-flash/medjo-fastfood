import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided. Access denied." });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    return res.status(401).json({ message: "Invalid token. Access denied." });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};


// import e from "express";
// import ratelimit from "../config/upstash.js";

// const rateLimiter = async (req,res,next) => {

//   try{
//     const { success } = await ratelimit.limit("my-limit-key");  

//     if(!success){
//       return res.status(429).json({ message: "Too many requests, please try again later." });
//     }

//     next();
//   }catch(error){
//     console.log("Error in rate limiter middleware:", error);
//     next(error);
// }
// };
// export default rateLimiter;