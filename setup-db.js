require('dotenv').config();
const { Pool } = require('pg');

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS birth_details (
    id SERIAL PRIMARY KEY,
    date_of_birth DATE NOT NULL,
    time_of_birth TIME NOT NULL,
    place_of_birth VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupDatabase() {
  let client;
  try {
    client = await pool.connect();
    await client.query(createTableQuery);
    console.log('Table \'birth_details\' created successfully or already exists.');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    if (client) {
      client.release();
    }
    pool.end();
  }
}

setupDatabase();
