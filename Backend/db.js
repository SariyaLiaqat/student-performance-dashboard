// const oracledb = require("oracledb");

// async function initialize() {
//     try {
//         await oracledb.createPool({
//             user: "STUDENT_DASHBOARD",  // ✅ Tumhara username
//             password: "Student123",     // ✅ Tumhara password
//             connectString: "localhost:1521/xe", // ✅ Verify karo ke ye sahi hai
//             poolMin: 2,  
//             poolMax: 10, 
//             poolIncrement: 2, 
//         });
//         console.log("✅ Database connection pool created successfully.");
//     } catch (err) {
//         console.error("❌ Error initializing database: ", err);
//         process.exit(1);
//     }
// }

// // ✅ Corrected: Get connection from pool instead of directly calling getConnection()
// async function getConnection() {
//     try {
//         const connection = await oracledb.getPool().getConnection();
//         return connection;
//     } catch (err) {
//         console.error("❌ Error getting database connection:", err);
//         throw err;
//     }
// }

// // ✅ Gracefully close the pool
// async function close() {
//     try {
//         await oracledb.getPool().close();
//         console.log("✅ Database connection pool closed.");
//     } catch (err) {
//         console.error("❌ Error closing database: ", err);
//     }
// }

// module.exports = { initialize, getConnection, close };



//  update 


// db.js - PostgreSQL version
const { Pool } = require('pg');

// ✅ PostgreSQL pool configuration
const pool = new Pool({
    user: 'postgres',              // Tumhara PostgreSQL username
    host: 'localhost',             // Host
    database: 'hospital_db', // Database name
    password: 'heartbroken009',        // Password
    port: 5432,                    // Default PostgreSQL port
    max: 10,                       // Max connections
    min: 2,                        // Min connections
});

// ✅ Get connection from pool
async function getConnection() {
    try {
        const client = await pool.connect();
        return client;
    } catch (err) {
        console.error("❌ Error getting database connection:", err);
        throw err;
    }
}

// ✅ Gracefully close the pool
async function close() {
    try {
        await pool.end();
        console.log("✅ Database connection pool closed.");
    } catch (err) {
        console.error("❌ Error closing database:", err);
    }
}

module.exports = { pool, getConnection, close };
