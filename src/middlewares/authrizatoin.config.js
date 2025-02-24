import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    console.log('Request path:', req.path);
    console.log('Authorization header:', req.headers["authorization"]);
    
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(403).json({ error: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET || "mysecretkey");
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

export default verifyToken;
