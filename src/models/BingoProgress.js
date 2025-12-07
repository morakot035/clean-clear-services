import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  index: Number,
  title: String,
  completed: { type: Boolean, default: false },
  imageUrl: { type: String, default: null },
  uploadedAt: { type: Date, default: null },
});

const BingoProgressSchema = new mongoose.Schema({
  employeeId: String,
  fullName: String,
  department: String,
  tasks: [TaskSchema],
});

export default mongoose.model("BingoProgress", BingoProgressSchema);
