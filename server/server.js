import pkg from 'pg';
import path from 'path';
import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { questions } from '../UtilFiles/quizQuestions.js';


const { Client } = pkg;
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 5050;
const app = express();


const db = new Client({
    user: 'Siyabonga',
    host: 'localhost',
    database: 'quiz_app',
    password: 'Siya@100',
    port: 5432,
});

async function connectDb() {
    try {
        await db.connect();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error.message);
    }
}
connectDb();


let score = 0;
let totalQuestions = questions.length;
let percent = ((score / totalQuestions) * 100).toFixed(2);
let date = new Date();


function checkAnswer(selectedOption) {
    if (selectedOption === questions[currentQuestion].correct) {
        score++;
    }
    document.getElementById('next-btn').classList.remove('hidden');
  }


app.use(express.static(path.join(__dirname, '../client')));
app.use('/UtilFiles', express.static(path.join(__dirname, '../UtilFiles')));
app.use(express.json());

// Function to save score to the database
async function saveScoreToDb(name, score, totalQuestions, percent, date, email) {
    const query = `
        INSERT INTO myquizscore (name, score, totalQuestions, percent, date, email)
        VALUES ($1, $2, $3, $4, $5, $6);
    `;
    try {
        const result = await db.query(query, [name, score, totalQuestions, percent, date, email]);
        console.log('Inserted row:', result.rows[0])
        return result.rows[0];
    } catch (error) {
        console.error('Error during database insert:', error.message);
        throw new Error('Failed to save quiz score to the database');
    }
}

// POST endpoint to save score
app.post('/submit-score', async (req, res) => {
    const {name, score, totalQuestions, percent, date, email } = req.body;
    // console.log('Received data:', req.body);
    // if (!name || !score|| !totalQuestions || !email||!percent||!date) {
    //     console.error('All fields (name, score, totalQuestions, percent, date, email) are required.');
    //     return res.status(400).json({ error: 'All fields (name, score, percent, email, date) are required' });
    // }

    try {
        await saveScoreToDb(name, score, totalQuestions, percent, date, email);
        res.status(200).json({ message: 'Score saved successfully!' });
    } catch (error) {
        console.error('Detailed error saving score:', error.message); 
        res.status(500).json({ error: 'Failed to save score' });
    }
});


// GET endpoint to fetch high scores
app.get('/high-scores', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT name, score, totalQuestions, percent, date, email FROM myquizscore ORDER BY score DESC LIMIT 10
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching high scores:', error.message);
        res.status(500).json({ error: 'Failed to fetch high scores' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});