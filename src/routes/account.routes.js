import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createAccount,
  getUserAccount,
} from "../controllers/account.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createAccount);

router.get("/", authMiddleware, getUserAccount);

export default router;
