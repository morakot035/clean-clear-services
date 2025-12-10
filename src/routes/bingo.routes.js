import express from "express";
import {
  getProgress,
  updateTask,
  leaderBoard,
  uploadImage,
} from "../controllers/bingo.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/progress", verifyToken, getProgress);
router.post("/update", verifyToken, updateTask);
router.get("/leaderboard", verifyToken, leaderBoard);
router.post(
  "/upload",
  verifyToken,
  upload.single("image"), // field name จาก frontend: formData.append("image", file)
  uploadImage
);

export default router;
