import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  department: { type: String, required: true },
  employeeId: { type: String, required: true },
  fullName: { type: String },
});

export default mongoose.model("Employee", userSchema);
