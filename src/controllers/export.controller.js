import ExcelJS from "exceljs";

export const exportLeaderboard = async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Leaderboard");

  sheet.columns = [
    { header: "ชื่อ", key: "fullName" },
    { header: "รหัส", key: "employeeId" },
    { header: "Dept", key: "department" },
    { header: "Completed", key: "completedCount" },
    { header: "Stars", key: "stars" },
  ];

  leaderboard.forEach((user, i) => {
    sheet.addRow(user);
    user.images.forEach(async (img) => {
      const imgBuffer = await fetch(img.imageUrl).then((r) => r.arrayBuffer());
      const imageId = workbook.addImage({
        buffer: Buffer.from(imgBuffer),
        extension: "jpg",
      });
      sheet.addImage(imageId, {
        tl: { col: 0, row: i + 1 },
        ext: { width: 100, height: 100 },
      });
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  await workbook.xlsx.write(res);
  res.end();
};
