// api/metrics.js

const { Pool } = require('pg');

let pool;

// Initialize connection pool
function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_SSL_CERT,
      },
    });
  }
  return pool;
}

export default async function handler(req, res) {
  const pool = getPool();

  try {
    const client = await pool.connect();

    //adjust maybe
    const sqlQuery = `
      SELECT heartbeat, fri_score, timestamp
      FROM health_metrics
      ORDER BY timestamp DESC
      LIMIT 1
    `;

    const result = await client.query(sqlQuery);

    client.release();

    if (result.rows.length > 0) {
      const { heartbeat, fri_score, timestamp } = result.rows[0];
      res.status(200).json({
        heartbeat,
        fri_score,
        timestamp,
      });
    } else {
      res.status(404).json({ error: 'No data found.' });
    }
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
