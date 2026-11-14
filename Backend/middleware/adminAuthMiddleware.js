import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Admin token required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "admin" || !decoded.id) {
      return res.status(403).json({
        message: "Admin access denied",
      });
    }

    req.adminId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired admin token",
    });
  }
};