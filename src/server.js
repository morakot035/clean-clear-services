import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import bingoRoutes from "./routes/bingo.routes.js";

config();
connectDB();

const app = express();
app.use(express.json());

// ✅ CORS (ต้องอยู่บน)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://clean-clear-prod.vercel.app",
      "https://clean-clear-services.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options(/.*/, cors());

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api/bingo", bingoRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
