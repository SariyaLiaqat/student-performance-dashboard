const oracledb = require("oracledb");

async function insertUser() {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: "student_dashboard",
            password: "Student123",
            connectString: "localhost/XEPDB1"
        });

        const result = await connection.execute(
            `INSERT INTO users (username, password) VALUES (:username, :password)`,
            { username: "testuser", password: "test123" },  // Change these values if needed
            { autoCommit: true }
        );

        console.log("✅ User inserted successfully!", result.rowsAffected);
    } catch (err) {
        console.error("❌ Error inserting user:", err);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

insertUser();
