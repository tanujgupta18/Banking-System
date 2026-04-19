import express from "express";

import {
  createInitialFundsTransaction,
  createTransaction,
} from "../controllers/transaction.controller.js";
import {
  authMiddleware,
  authSystemUserMiddleware,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTransaction);

router.post(
  "/system/initial-funds",
  authSystemUserMiddleware,
  createInitialFundsTransaction,
);
export default router;
