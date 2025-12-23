import express from "express";
import { exportLeaderboardExcel } from "../controllers/export.controller.js";

const router = express.Router();

router.get("/leaderboard/excel", exportLeaderboardExcel);

export default router;
