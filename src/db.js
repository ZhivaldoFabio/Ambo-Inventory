// db.js
import dotenv from 'dotenv';
dotenv.config();

import { createConnection } from 'mysql2/promise';

const connection = await createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // This ensures the pool waits for a connection to be available
  connectionLimit: 10, // The maximum number of connections to create at once
  queueLimit: 0, // Unlimited queue limit (optional)
});

process.on('SIGINT', async () => {
  await connection.end();  // Close the connection when the app is stopped
  console.log('MySQL connection closed');
  process.exit();
});

export default connection;
