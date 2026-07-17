import jwt from "jsonwebtoken";
export const isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No Token",
    });
  }

  const token = authHeader.split(" ")[1];

  

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    req.userId = decoded.id;

    next();
  } catch (err) {
    console.log(err);

    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};
