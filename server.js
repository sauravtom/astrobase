
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');
const OpenAI = require('openai');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// --- Database Setup ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// SQL command to create the table
// CREATE TABLE birth_details (
//   id SERIAL PRIMARY KEY,
//   date_of_birth DATE NOT NULL,
//   time_of_birth TIME NOT NULL,
//   place_of_birth VARCHAR(255) NOT NULL,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
// );

pool.connect().then(() => {
    console.log('Connected to PostgreSQL database');
}).catch(err => {
    console.error('Error connecting to PostgreSQL database', err);
});


// --- OpenAI Setup ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());
app.use(express.static(path.join(__dirname)));


// --- API Endpoints ---

// Generate Chart Endpoint
app.post('/api/generate-chart', async (req, res) => {
  const { date, time, place } = req.body;

  if (!date || !time || !place) {
    return res.status(400).json({ error: 'Missing required birth details.' });
  }

  try {
    // 1. Save to database
    const query = 'INSERT INTO birth_details(date_of_birth, time_of_birth, place_of_birth) VALUES($1, $2, $3) RETURNING *';
    await pool.query(query, [date, time, place]);

    // 2. Call external planetary API
    const planetaryResponse = await axios.post(
      process.env.PLANETARY_API_URL,
      { date, time, place }
    );

    // 3. Return planetary data
    res.json(planetaryResponse.data);

  } catch (error) {
    console.error('Error in /api/generate-chart:', error);
    res.status(500).json({ error: 'Failed to generate chart. Please check server logs.' });
  }
});

// Chat Endpoint
app.post('/api/chat', async (req, res) => {
  const { planetaryPositions, userQuestion } = req.body;

  if (!planetaryPositions || !userQuestion) {
    return res.status(400).json({ error: 'Missing planetary positions or user question.' });
  }

  const prompt = `
    You are an expert Vedic astrologer. Your tone is insightful, wise, and helpful. Based ONLY on the provided birth chart JSON data, answer the user's question concisely.

    BIRTH CHART DATA:
    ${JSON.stringify(planetaryPositions)}

    USER'S QUESTION:
    ${userQuestion}
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
    });

    res.json({ answer: completion.choices[0].message.content });

  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Failed to get response from AI. Please check server logs.' });
  }
});

// --- Serve Frontend ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
