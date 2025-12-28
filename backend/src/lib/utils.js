import jwt from "jsonwebtoken";

// Utility function to generate JWT token and set it in HTTP-only cookie
export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { 
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true, // prevent XSS cross-site scripting attacks
        sameSite: "strict", // CSRF cross-site request forgery protection
        secure: process.env.NODE_ENV !== "development", // only true in production
    });
    return token;
};
