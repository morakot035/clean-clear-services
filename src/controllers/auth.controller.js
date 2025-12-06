import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";

const signToken = (employee) =>
  jwt.sign(
    {
      id: employee._id,
      employeeId: employee.employeeId,
      department: employee.department,
      fullName: employee.fullName,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

export const login = async (req, res) => {
  try {
    const { department, employeeId } = req.body;

    const employee = await Employee.findOne({
      department: department,
      employeeId: employeeId,
    });

    if (!employee) {
      return res.status(400).json({
        success: false,
        error: {
          code: "AUTH_INVALID",
          message: "รหัสพนักงานหรือฝ่ายไม่ถูกต้อง",
        },
      });
    }

    const token = signToken(employee);

    res.json({
      success: true,
      token,
      employee,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์",
      },
    });
  }
};

export const me = (req, res) => {
  res.json(req.employee);
};
