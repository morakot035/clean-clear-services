// src/middlewares/upload.middleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "../uploads");

// ถ้าโฟลเดอร์ยังไม่มี ให้สร้าง
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // เก็บไฟล์ในโฟลเดอร์ /uploads
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // .jpg, .png ฯลฯ
    cb(null, unique + ext);
  },
});

export const upload = multer({ storage });
