const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    const res = await pool.query('SELECT email, "fullName", "tenantId" FROM users LIMIT 10');
    console.log("Users in DB:", res.rows);
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    pool.end();
  }
}
run();
