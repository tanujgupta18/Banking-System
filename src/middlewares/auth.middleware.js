import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export async function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorised access, token is missing",
    });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId).select("-password");

    req.user = user;

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorised access, token is invalid",
    });
  }
}
