import ExcelJS from "exceljs";
import axios from "axios";
import path from "path";

export async function exportLeaderboardExcel(req, res) {
  try {
    // 👉 ตรงนี้ใช้ logic เดิมที่คุณดึง leaderboard
    const leaderboard = await getLeaderboardFromDB(); // << ของคุณมีอยู่แล้ว

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Leaderboard");

    sheet.columns = [
      { header: "ลำดับ", key: "no", width: 8 },
      { header: "รหัสพนักงาน", key: "employeeId", width: 16 },
      { header: "ชื่อ-นามสกุล", key: "fullName", width: 28 },
      { header: "แผนก", key: "department", width: 18 },
      { header: "ดาว", key: "stars", width: 8 },
      { header: "รูปกิจกรรม", key: "image", width: 20 },
    ];

    let rowIndex = 2;

    for (let i = 0; i < leaderboard.length; i++) {
      const user = leaderboard[i];

      sheet.addRow({
        no: i + 1,
        employeeId: user.employeeId,
        fullName: user.fullName,
        department: user.department,
        stars: user.stars,
      });

      // 👉 เอาแค่รูปแรก (หรือจะ loop ทุกภาพก็ได้)
      if (user.images.length > 0) {
        const imageUrl = process.env.API_URL + user.images[0].imageUrl;

        const imageBuffer = await axios.get(imageUrl, {
          responseType: "arraybuffer",
        });

        const imageId = workbook.addImage({
          buffer: imageBuffer.data,
          extension: "jpeg",
        });

        sheet.addImage(imageId, {
          tl: { col: 5, row: rowIndex - 1 },
          ext: { width: 120, height: 120 },
        });

        sheet.getRow(rowIndex).height = 95;
      }

      rowIndex++;
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Christmas_Bingo_Leaderboard.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Export excel failed" });
  }
}
