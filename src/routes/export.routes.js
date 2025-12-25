import express from "express";
import { exportLeaderboard } from "../controllers/export.controller.js";

const router = express.Router();

router.get("/leaderboard/excel", exportLeaderboard);

export default router;
