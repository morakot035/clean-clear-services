import express from "express";
import {
  getProgress,
  updateTask,
  leaderBoard,
} from "../controllers/bingo.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/progress", verifyToken, getProgress);
router.post("/update", verifyToken, updateTask);
router.get("/leaderboard", verifyToken, leaderBoard);

export default router;
