const mysql = require("mysql2");
require("dotenv").config();

const MAX_RETRIES = 5;
let retries = 0;

function connectWithRetry() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return new Promise((resolve, reject) => {
    function tryConnect() {
      pool.getConnection((err, connection) => {
        if (err) {
          console.error("Database connection failed:", err.message);
          retries++;
          if (retries <= MAX_RETRIES) {
            console.log(`Retrying to connect... (${retries}/${MAX_RETRIES})`);
            setTimeout(tryConnect, 2000);
          } else {
            reject(new Error("Max retries reached"));
          }
        } else {
          console.log("MySQL connected successfully.");
          connection.release();
          resolve(pool.promise());
        }
      });
    }

    tryConnect();
  });
}

module.exports = connectWithRetry;