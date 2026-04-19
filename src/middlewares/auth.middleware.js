import tokenBlacklistModel from "../models/blacklist.model.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export async function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorised access, token is missing",
    });
  }

  const isBlacklisted = await tokenBlacklistModel.findOne({ token });

  if (isBlacklisted) {
    return res.status(401).json({
      message: "Unauthorized access, token is invalid",
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

export async function authSystemUserMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorised access, token is missing",
    });
  }

  const isBlacklisted = await tokenBlacklistModel.findOne({ token });

  if (isBlacklisted) {
    return res.status(401).json({
      message: "Unauthorized access, token is invalid",
    });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId).select("+systemUser");

    if (!user.systemUser) {
      return res.status(403).json({
        message: "Forbidden access,not a system user",
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorised access, token is invalid",
    });
  }
}
