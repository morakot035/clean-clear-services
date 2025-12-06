import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";

export const verifyToken = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token" });
  }

  const token = bearer.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.employee = await Employee.findById(decoded.id);

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token invalid" });
  }
};
