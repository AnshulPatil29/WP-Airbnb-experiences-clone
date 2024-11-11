const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); 

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',             
    password: 'password',
    database: 'card_db'        
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

app.get('/api/cards', (req, res) => {
    const sql = 'SELECT * FROM cards';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching all cards:', err);
            res.status(500).json({ error: 'Failed to fetch cards' });
            return;
        }
        res.json(results);
    });
});

app.get('/api/search', (req, res) => {
    const { query } = req.query;
    const sql = `
        SELECT *, 
            MATCH(title, description) AGAINST(?) AS relevance
        FROM cards 
        WHERE MATCH(title, description) AGAINST(?)
        ORDER BY relevance DESC 
        LIMIT 5;
    `;
    db.query(sql, [query, query], (err, results) => {
        if (err) {
            console.error('Error executing search query:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

app.get('/api/cards/:id', (req, res) => {
    const cardId = req.params.id;

    const cardQuery = 'SELECT * FROM cards WHERE id = ?';
    const reviewsQuery = 'SELECT reviewer_name, review_text, rating, created_at FROM reviews WHERE card_id = ?';

    db.query(cardQuery, [cardId], (err, cardResults) => {
        if (err) {
            console.error('Error fetching card data:', err);
            res.status(500).json({ error: 'Failed to fetch card data' });
            return;
        }

        if (cardResults.length === 0) {
            res.status(404).json({ error: 'Card not found' });
            return;
        }

        db.query(reviewsQuery, [cardId], (err, reviewResults) => {
            if (err) {
                console.error('Error fetching reviews:', err);
                res.status(500).json({ error: 'Failed to fetch reviews' });
                return;
            }

            res.json({
                card: cardResults[0],
                reviews: reviewResults
            });
        });
    });
});

app.post('/api/reviews', (req, res) => {
    const { cardId, reviewerName, reviewText, rating } = req.body;

    if (!cardId || !reviewerName || !reviewText || !rating) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = 'INSERT INTO reviews (card_id, reviewer_name, review_text, rating) VALUES (?, ?, ?, ?)';
    db.query(sql, [cardId, reviewerName, reviewText, rating], (err, result) => {
        if (err) {
            console.error('Error inserting review:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }

        const newReview = {
            id: result.insertId,
            card_id: cardId,
            reviewer_name: reviewerName,
            review_text: reviewText,
            rating: rating,
            created_at: new Date() 
        };

        res.status(201).json({ message: 'Review added successfully', review: newReview });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
