
const express = require("express");
const bcrypt = require("bcrypt");
const oracledb = require("oracledb");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../db");

const SECRET_KEY = "your_secret_key"; // 🔐 Consider using .env file for this

// 🔐 Password strength checker function
function isStrongPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
}

// 🟢 Registration Route
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    // ✅ Check for password strength
    if (!isStrongPassword(password)) {
        return res.status(400).json({
            message: "❌ Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*)",
            success: false
        });
    }

    let connection;
    try {
        connection = await db.getConnection();

        // 🟢 Check if user already exists
        const result = await connection.execute(
            `SELECT COUNT(*) AS COUNT FROM users WHERE username = :username`,
            { username },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows[0].COUNT > 0) {
            return res.status(400).json({ message: "❌ User already exists", success: false });
        }

        // 🟢 Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🟢 Insert new user into the database
        await connection.execute(
            `INSERT INTO users (username, password) VALUES (:username, :password)`,
            { username, password: hashedPassword },
            { autoCommit: true }
        );

        res.status(201).json({ message: "✅ Registration Successful! Redirecting to Login...", success: true });

    } catch (err) {
        console.error("Error in registration:", err);
        res.status(500).json({ message: "❌ Server Error", success: false });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

// 🟢 Login Route with JWT
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    let connection;
    try {
        connection = await db.getConnection();

        // 🟢 Check if user exists
        const result = await connection.execute(
            `SELECT username, password FROM users WHERE username = :username`,
            { username },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (!result.rows || result.rows.length === 0) {
            return res.status(401).json({ message: "❌ Register yourself first!", success: false });
        }

        // 🟢 Verify the password
        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.PASSWORD);

        if (!passwordMatch) {
            return res.status(401).json({ message: "❌ Invalid Credentials", success: false });
        }

        // 🟢 Generate JWT Token
        const token = jwt.sign({ username: user.USERNAME }, SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({ message: "✅ Login Successful! Redirecting to Dashboard...", success: true, token });

    } catch (err) {
        console.error("Error in login:", err);
        res.status(500).json({ message: "❌ Server Error", success: false });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

module.exports = router;
