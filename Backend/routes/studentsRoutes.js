
// const express = require("express");
// const router = express.Router();
// const db = require("../db");
// const oracledb = require("oracledb");

// // ✅ Add New Student
// router.post("/add", async (req, res) => {
//     const { rollNumber, name, math, eng, urd, sci } = req.body;
//     let connection;
//     try {
//         connection = await oracledb.getConnection();

//         const check = await connection.execute(
//             `SELECT COUNT(*) AS COUNT FROM students WHERE ROLLNUMBER = :rollNumber`,
//             { rollNumber },
//             { outFormat: oracledb.OUT_FORMAT_OBJECT }
//         );

//         if (check.rows[0].COUNT > 0) {
//             return res.status(400).json({ message: "Roll number already exists", success: false });
//         }

//         await connection.execute(
//             `INSERT INTO students (ROLLNUMBER, NAME, MATH, ENG, URD, SCI) 
//              VALUES (:rollNumber, :name, :math, :eng, :urd, :sci)`,
//             { rollNumber, name, math, eng, urd, sci },
//             { autoCommit: true }
//         );

//         res.status(201).json({ message: "Student added successfully!", success: true });
//     } catch (err) {
//         console.error("Add Error:", err);
//         res.status(500).json({ message: "Server Error", success: false });
//     } finally {
//         if (connection) await connection.close();
//     }
// });

// // ✅ Get All Students
// router.get("/all", async (req, res) => {
//     let connection;
//     try {
//         connection = await oracledb.getConnection();
//         const result = await connection.execute(
//             `SELECT ROLLNUMBER, NAME, MATH, ENG, URD, SCI,
//                     (MATH + ENG + URD + SCI) AS TOTAL,
//                     ROUND((MATH + ENG + URD + SCI)/4, 2) AS PERCENTAGE
//              FROM students`,
//             [],
//             { outFormat: oracledb.OUT_FORMAT_OBJECT }
//         );

//         res.status(200).json({ students: result.rows || [], success: true });
//     } catch (err) {
//         console.error("Fetch Error:", err);
//         res.status(500).json({ message: "Server Error", success: false });
//     } finally {
//         if (connection) await connection.close();
//     }
// });

// // ✅ Get Single Student by Roll Number (for Edit Form)
// router.get("/:rollNumber", async (req, res) => {
//     const { rollNumber } = req.params;
//     let connection;
//     try {
//         connection = await oracledb.getConnection();
//         const result = await connection.execute(
//             `SELECT ROLLNUMBER, NAME, MATH, ENG, URD, SCI 
//              FROM students WHERE ROLLNUMBER = :rollNumber`,
//             { rollNumber },
//             { outFormat: oracledb.OUT_FORMAT_OBJECT }
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({ message: "Student not found", success: false });
//         }

//         res.status(200).json({ student: result.rows[0], success: true });
//     } catch (err) {
//         console.error("Fetch Single Error:", err);
//         res.status(500).json({ message: "Server Error", success: false });
//     } finally {
//         if (connection) await connection.close();
//     }
// });

// // ✅ Update Student
// router.put("/update/:rollNumber", async (req, res) => {
//     const { rollNumber } = req.params;
//     const { name, math, eng, urd, sci } = req.body;
//     let connection;
//     try {
//         connection = await oracledb.getConnection();
//         const result = await connection.execute(
//             `UPDATE students 
//              SET NAME = :name, MATH = :math, ENG = :eng, URD = :urd, SCI = :sci 
//              WHERE ROLLNUMBER = :rollNumber`,
//             { name, math, eng, urd, sci, rollNumber },
//             { autoCommit: true }
//         );

//         if (result.rowsAffected === 0) {
//             return res.status(404).json({ message: "Student not found", success: false });
//         }

//         res.status(200).json({ message: "Student updated successfully", success: true });
//     } catch (err) {
//         console.error("Update Error:", err);
//         res.status(500).json({ message: "Server Error", success: false });
//     } finally {
//         if (connection) await connection.close();
//     }
// });

// // ✅ Delete Student
// router.delete("/delete/:rollNumber", async (req, res) => {
//     const { rollNumber } = req.params;
//     let connection;
//     try {
//         connection = await oracledb.getConnection();
//         const result = await connection.execute(
//             `DELETE FROM students WHERE ROLLNUMBER = :rollNumber`,
//             { rollNumber },
//             { autoCommit: true }
//         );

//         if (result.rowsAffected === 0) {
//             return res.status(404).json({ message: "Student not found", success: false });
//         }

//         res.status(200).json({ message: "Student deleted successfully", success: true });
//     } catch (err) {
//         console.error("Delete Error:", err);
//         res.status(500).json({ message: "Server Error", success: false });
//     } finally {
//         if (connection) await connection.close();
//     }
// });

// module.exports = router;



// updated---



const express = require("express");
const router = express.Router();
const db = require("../db"); // PostgreSQL pool

// ✅ Add New Student
router.post("/add", async (req, res) => {
    const { name, math, eng, urd, sci } = req.body;
    const client = await db.getConnection();

    try {
        // Insert student (rollnumber auto-increment)
        const result = await client.query(
            `INSERT INTO students (name, math, eng, urd, sci)
             VALUES ($1, $2, $3, $4, $5) RETURNING rollnumber`,
            [name, math, eng, urd, sci]
        );

        res.status(201).json({ 
            message: "✅ Student added successfully!", 
            success: true,
            rollNumber: result.rows[0].rollnumber 
        });
    } catch (err) {
        console.error("Add Error:", err);
        res.status(500).json({ message: "❌ Server Error", success: false });
    } finally {
        client.release();
    }
});

// ✅ Get All Students
router.get("/all", async (req, res) => {
    const client = await db.getConnection();
    try {
        const result = await client.query(
            `SELECT rollnumber, name, math, eng, urd, sci,
                    (math + eng + urd + sci) AS total,
                    ROUND((math + eng + urd + sci)/4.0, 2) AS percentage
             FROM students`
        );

        res.status(200).json({ students: result.rows || [], success: true });
    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ message: "❌ Server Error", success: false });
    } finally {
        client.release();
    }
});

// ✅ Get Single Student by Roll Number
router.get("/:rollNumber", async (req, res) => {
    const { rollNumber } = req.params;
    const client = await db.getConnection();

    try {
        const result = await client.query(
            `SELECT rollnumber, name, math, eng, urd, sci 
             FROM students WHERE rollnumber = $1`,
            [rollNumber]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "❌ Student not found", success: false });
        }

        res.status(200).json({ student: result.rows[0], success: true });
    } catch (err) {
        console.error("Fetch Single Error:", err);
        res.status(500).json({ message: "❌ Server Error", success: false });
    } finally {
        client.release();
    }
});

// ✅ Update Student
router.put("/update/:rollNumber", async (req, res) => {
    const { rollNumber } = req.params;
    const { name, math, eng, urd, sci } = req.body;
    const client = await db.getConnection();

    try {
        const result = await client.query(
            `UPDATE students 
             SET name = $1, math = $2, eng = $3, urd = $4, sci = $5
             WHERE rollnumber = $6`,
            [name, math, eng, urd, sci, rollNumber]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "❌ Student not found", success: false });
        }

        res.status(200).json({ message: "✅ Student updated successfully", success: true });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ message: "❌ Server Error", success: false });
    } finally {
        client.release();
    }
});

// ✅ Delete Student
router.delete("/delete/:rollNumber", async (req, res) => {
    const { rollNumber } = req.params;
    const client = await db.getConnection();

    try {
        const result = await client.query(
            `DELETE FROM students WHERE rollnumber = $1`,
            [rollNumber]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "❌ Student not found", success: false });
        }

        res.status(200).json({ message: "✅ Student deleted successfully", success: true });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ message: "❌ Server Error", success: false });
    } finally {
        client.release();
    }
});

module.exports = router;
