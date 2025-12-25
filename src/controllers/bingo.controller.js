import BingoProgress from "../models/BingoProgress.js";
import Employee from "../models/Employee.js";
import jwt from "jsonwebtoken";

// ---- Helper: Decode JWT ----
const decodeToken = (req) => {
  const auth = req.headers.authorization;
  if (!auth) return null;

  const token = auth.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET);
};

// ---- 1) ดึงสถานะของพนักงาน ----
export const getProgress = async (req, res) => {
  try {
    const payload = decodeToken(req);
    if (!payload) return res.status(401).json({ success: false });

    const employee = await Employee.findById(payload.id);
    if (!employee) return res.status(404).json({ success: false });

    // ค้น progress
    let progress = await BingoProgress.findOne({
      employeeId: employee.employeeId,
    });

    // ถ้าไม่มี → สร้าง progress ใหม่
    if (!progress) {
      const tasksTemplate = [
        "เคลียร์ไฟล์ในDesktop",
        "จัดเก็บเอกสารบนโต๊ะ 1 จุดหากมีกาวใส่เอกสาร",
        "ทำความสะอาด Notebook/ Keyboard/ Mouse",
        "เคลียร์เอกสารที่ไม่ได้ใช้เกิน 3 ปี",
        "จัดโต๊ะทำงานให้เป็นระเบียบ",
        "ติด Label ใหม่ 2 จุด เพื่อบ่งชี้",
        "โต๊ะทำงานมีของไม่จำเป็นไม่เกิน 2 ชิ้น",
        "อุปกรณ์สำนักงานจัดเก็บในลิ้นชัก/บนโต๊ะเรียบร้อย",
        "อุปกรณ์สำนักงานจัดเก็บในลิ้นชัก/บนโต๊ะเรียบร้อย",
      ];

      progress = await BingoProgress.create({
        employeeId: employee.employeeId,
        fullName: employee.fullName,
        department: employee.department,
        tasks: tasksTemplate.map((t, i) => ({
          index: i,
          title: t,
          completed: false,
        })),
      });
    }

    res.json({ success: true, progress });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// ---- 2) อัพโหลดรูปแล้ว mark task completed ----
export const updateTask = async (req, res) => {
  try {
    const payload = decodeToken(req);
    if (!payload) return res.status(401).json({ success: false });

    const { taskIndex, imageUrl } = req.body;

    const employee = await Employee.findById(payload.id);

    const progress = await BingoProgress.findOne({
      employeeId: employee.employeeId,
    });

    if (!progress) return res.status(404).json({ success: false });

    // update
    progress.tasks[taskIndex].completed = true;
    progress.tasks[taskIndex].imageUrl = imageUrl;
    progress.tasks[taskIndex].uploadedAt = new Date();

    await progress.save();

    res.json({ success: true, progress });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Update failed" });
  }
};

export const leaderBoard = async (req, res) => {
  try {
    const users = await BingoProgress.find().lean();

    const leaderboard = users.map((u) => {
      // นับ task completed
      const completedCount = u.tasks.filter((t) => t.completed).length;

      // คำนวณดาว (ทุก 3 ช่อง = 1 ดาว)
      const stars = Math.floor(completedCount / 3);

      // เก็บรูปภาพจาก task
      const images = u.tasks
        .filter((t) => t.completed && t.imageUrl)
        .map((t) => ({
          index: t.index,
          title: t.title,
          imageUrl: t.imageUrl,
          uploadedAt: t.uploadedAt,
        }));

      return {
        employeeId: u.employeeId,
        fullName: u.fullName,
        department: u.department,
        completedCount,
        stars,
        images,
      };
    });

    res.json({
      success: true,
      leaderboard,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const payload = decodeToken(req);
    if (!payload) return res.status(401).json({ success: false });

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    // Cloudinary storage อยู่ใน req.file.path
    const imageUrl = req.file.path;

    return res.json({
      success: true,
      imageUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Upload image failed" });
  }
};
