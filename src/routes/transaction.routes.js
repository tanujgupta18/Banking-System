import express from "express";
import { createTransaction } from "../controllers/transaction.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTransaction);
export default router;
