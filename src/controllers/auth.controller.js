import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendRegistrationEmail } from "../services/email.service.js";
import tokenBlacklistModel from "../models/blacklist.model.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // check existing user
    const isExist = await userModel.findOne({ email });

    if (isExist) {
      return res.status(409).json({
        message: "User already exists with email",
      });
    }

    const user = await userModel.create({
      name,
      email,
      password,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.cookie("token", token);

    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });

    await sendRegistrationEmail(user.email, user.name);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "All fields are required",
      });
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Email or Password is Invalid",
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Email or Password is Invalid",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token);

    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function logout(req, res) {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(200).json({
        message: "User logged out successfully",
      });
    }

    await tokenBlacklistModel.create({
      token: token,
    });

    res.clearCookie("token");

    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
