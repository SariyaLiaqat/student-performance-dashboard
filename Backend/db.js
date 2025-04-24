const oracledb = require("oracledb");

async function initialize() {
    try {
        await oracledb.createPool({
            user: "STUDENT_DASHBOARD",  // ✅ Tumhara username
            password: "Student123",     // ✅ Tumhara password
            connectString: "localhost:1521/xe", // ✅ Verify karo ke ye sahi hai
            poolMin: 2,  
            poolMax: 10, 
            poolIncrement: 2, 
        });
        console.log("✅ Database connection pool created successfully.");
    } catch (err) {
        console.error("❌ Error initializing database: ", err);
        process.exit(1);
    }
}

// ✅ Corrected: Get connection from pool instead of directly calling getConnection()
async function getConnection() {
    try {
        const connection = await oracledb.getPool().getConnection();
        return connection;
    } catch (err) {
        console.error("❌ Error getting database connection:", err);
        throw err;
    }
}

// ✅ Gracefully close the pool
async function close() {
    try {
        await oracledb.getPool().close();
        console.log("✅ Database connection pool closed.");
    } catch (err) {
        console.error("❌ Error closing database: ", err);
    }
}

module.exports = { initialize, getConnection, close };
