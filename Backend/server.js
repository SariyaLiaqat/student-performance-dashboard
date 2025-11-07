
// const express = require("express");
// const cors = require("cors");
// const db = require("./db");

// const app = express();

// // ✅ Middleware
// app.use(cors());
// app.use(express.json());

// // ✅ Debugging Middleware
// app.use((req, res, next) => {
//     console.log(`📢 [${req.method}] ${req.url}`);
//     next();
// });

// // ✅ Initialize Database Connection
// async function startServer() {
//     try {
//         await db.initialize();
//         console.log("✅ Database Connected Successfully!");

//         // ✅ Import Routes
//         const authRoutes = require("./routes/authRoutes");
//         const studentsRoutes = require("./routes/studentsRoutes");
//         const studentResultRoutes = require("./routes/studentResultRoutes"); // ✅ NEW

//         // ✅ Debugging Logs
//         console.log("✅ Students Routes Loaded!");
//         console.log("✅ Auth Routes Loaded!");
//         console.log("✅ Student Result Route Loaded!"); // ✅ NEW

//         // ✅ Use Routes
//         app.use("/api/auth", authRoutes);
//         app.use("/api/students", studentsRoutes);
//         app.use("/api/student-result", studentResultRoutes); // ✅ NEW

//         // ✅ Default Route
//         app.get("/", (req, res) => {
//             res.send("✅ Student Performance Dashboard Backend Running...");
//         });

//         // ✅ Handle Invalid Routes
//         app.use((req, res) => {
//             res.status(404).json({ message: "❌ Route Not Found", success: false });
//         });

//         // ✅ Server Start
//         const PORT = process.env.PORT || 5000;
//         app.listen(PORT, () => {
//             console.log(`🚀 Server is running on http://localhost:${PORT}`);
//         });

//     } catch (err) {
//         console.error("❌ Database Connection Failed:", err);
//         process.exit(1); // Exit if DB connection fails
//     }
// }

// // ✅ Start the server
// startServer();



// updated--


const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Debugging Middleware
app.use((req, res, next) => {
    console.log(`📢 [${req.method}] ${req.url}`);
    next();
});

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const studentsRoutes = require("./routes/studentsRoutes");
const studentResultRoutes = require("./routes/studentResultRoutes");

// ✅ Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/student-result", studentResultRoutes);

// ✅ Default Route
app.get("/", (req, res) => {
    res.send("✅ Student Performance Dashboard Backend Running...");
});

// ✅ Handle Invalid Routes
app.use((req, res) => {
    res.status(404).json({ message: "❌ Route Not Found", success: false });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
