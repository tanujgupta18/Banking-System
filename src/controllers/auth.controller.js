import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

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
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
