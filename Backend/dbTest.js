const db = require('./db'); // Apni db.js ko import karo

async function testConnection() {
    try {
        await db.initialize(); // Database pool initialize karo
        console.log("🎉 Database connection successful!"); // Success message

        // Ab ek simple query run karke dekhte hain
        const connection = await db.oracledb.getConnection();
        const result = await connection.execute("SELECT 1 FROM DUAL"); // Test query
        console.log("✅ Query Result:", result.rows);

        // Connection ko close kar do
        await connection.close();
    } catch (err) {
        console.error("❌ Database connection failed:", err);
    } finally {
        await db.close(); // Pool close kar do
    }
}

testConnection();
