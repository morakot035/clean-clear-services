import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "dotenv";
import path from "path";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import bingoRoutes from "./routes/bingo.routes.js";

config();
connectDB();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());
app.use((req, res, next) => {
  console.log(`📥 Request: ${req.method} ${req.url}`);
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api/bingo", bingoRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
