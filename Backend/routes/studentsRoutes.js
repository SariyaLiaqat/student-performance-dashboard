
const express = require("express");
const router = express.Router();
const db = require("../db");
const oracledb = require("oracledb");

// 🟢 Add Student (with Duplicate Roll Number Check)
router.post("/add", async (req, res) => {
    const { rollNumber, name, math, eng, urd, sci } = req.body;
    let connection;

    try {
        connection = await oracledb.getConnection();

        // 🔍 Check if roll number already exists
        const check = await connection.execute(
            `SELECT COUNT(*) AS COUNT FROM students WHERE ROLLNUMBER = :rollNumber`,
            { rollNumber },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (check.rows[0].COUNT > 0) {
            return res.status(400).json({
                message: "❌ Roll number already exists!",
                success: false
            });
        }

        // ✅ Insert if not exists
        await connection.execute(
            `INSERT INTO students (ROLLNUMBER, NAME, MATH, ENG, URD, SCI) 
             VALUES (:rollNumber, :name, :math, :eng, :urd, :sci)`,
            { rollNumber, name, math, eng, urd, sci },
            { autoCommit: true }
        );

        res.status(201).json({ message: "✅ Student added successfully!", success: true });

    } catch (err) {
        console.error("Error adding student:", err);
        res.status(500).json({ message: "❌ Server Error", success: false });
    } finally {
        if (connection) await connection.close();
    }
});

// 🟢 Get All Students
router.get("/all", async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT ROLLNUMBER, NAME, MATH, ENG, URD, SCI, TOTAL, PERCENTAGE FROM students`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.status(200).json({ students: result.rows || [], success: true });
    } catch (err) {
        console.error("Error fetching students:", err);
        res.status(500).json({ message: "❌ Server Error", success: false });
    } finally {
        if (connection) await connection.close();
    }
});

// 🟢 Delete Student by Roll Number
router.delete("/delete/:rollNumber", async (req, res) => {
    const { rollNumber } = req.params;
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `DELETE FROM students WHERE ROLLNUMBER = :rollNumber`,
            { rollNumber },
            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: "❌ Student not found!", success: false });
        }

        res.status(200).json({ message: "✅ Student deleted successfully!", success: true });
    } catch (err) {
        console.error("Error deleting student:", err);
        res.status(500).json({ message: "❌ Server Error", success: false });
    } finally {
        if (connection) await connection.close();
    }
});

// 🟢 Update Student Data by Roll Number
router.put("/update/:rollNumber", async (req, res) => {
    const { rollNumber } = req.params;
    const { name, math, eng, urd, sci } = req.body;
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `UPDATE students 
             SET NAME = :name, MATH = :math, ENG = :eng, URD = :urd, SCI = :sci 
             WHERE ROLLNUMBER = :rollNumber`,
            { name, math, eng, urd, sci, rollNumber },
            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: "❌ Student not found!", success: false });
        }

        res.status(200).json({ message: "✅ Student updated successfully!", success: true });
    } catch (err) {
        console.error("Error updating student:", err);
        res.status(500).json({ message: "❌ Server Error", success: false });
    } finally {
        if (connection) await connection.close();
    }
});

module.exports = router;
