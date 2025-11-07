
// const express = require("express");
// const router = express.Router();
// const db = require("../db");
// const oracledb = require("oracledb");

// // ✅ Route: View Result by Roll Number
// router.post("/view-result", async (req, res) => {
//   const { rollNumber } = req.body;
//   let connection;

//   try {
//     connection = await db.getConnection();

//     const result = await connection.execute(
//       `SELECT ROLLNUMBER, NAME, MATH, ENG, URD, SCI,
//               (MATH + ENG + URD + SCI) AS TOTAL,
//               ROUND((MATH + ENG + URD + SCI)/4, 2) AS PERCENTAGE
//        FROM students
//        WHERE ROLLNUMBER = :rollNumber`,
//       { rollNumber },
//       { outFormat: oracledb.OUT_FORMAT_OBJECT }
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "Result not found!" });
//     }

//     const student = result.rows[0];
//     res.status(200).json({
//       rollNumber: student.ROLLNUMBER,
//       name: student.NAME,
//       subjects: [student.MATH, student.ENG, student.URD, student.SCI],
//       total: student.TOTAL,
//       percentage: student.PERCENTAGE,
//     });
//   } catch (err) {
//     console.error("❌ Result Fetch Error:", err);
//     res.status(500).json({ message: "Server error" });
//   } finally {
//     if (connection) await connection.close();
//   }
// });

// module.exports = router;






// updated...

const express = require("express");
const router = express.Router();
const db = require("../db"); // PostgreSQL pool

// ✅ Route: View Result by Roll Number (Supports multi-digit / alphanumeric roll numbers)
router.post("/view-result", async (req, res) => {
  const { rollNumber } = req.body; // 🔹 Keep as string
  const client = await db.getConnection();

  try {
    const result = await client.query(
      `SELECT rollnumber, name, math, eng, urd, sci,
              (math + eng + urd + sci) AS total,
              ROUND((math + eng + urd + sci)/4.0, 2) AS percentage
       FROM students
       WHERE rollnumber = $1`,
      [rollNumber] // 🔹 Send as-is, no parseInt
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "❌ Result not found!" });
    }

    const student = result.rows[0];
    res.status(200).json({
      success: true,
      student: {
        rollNumber: student.rollnumber,
        name: student.name,
        math: parseFloat(student.math),
        eng: parseFloat(student.eng),
        urd: parseFloat(student.urd),
        sci: parseFloat(student.sci),
        total: parseFloat(student.total),
        percentage: parseFloat(student.percentage),
      },
    });
  } catch (err) {
    console.error("❌ Result Fetch Error:", err);
    res.status(500).json({ success: false, message: "❌ Server error" });
  } finally {
    client.release();
  }
});

module.exports = router;
