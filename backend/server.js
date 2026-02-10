const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

//connect to MongoDB
mongoose.connect('mongodb://localhost:27017/xo_games')
    .then(() => {console.log('Connected to MongoDB Successfully')})
    .catch(err => console.log(err));

//schema
const xoSchema = new mongoose.Schema({
    boardSize: Number,
    winner: String,
    moves: [{index: Number, player: String}],
    createdAt: { type: Date, default: Date.now }
});

const XoGame = mongoose.model('XoGame', xoSchema);

//routes
// game record
app.post('/api/v1/history', async (req, res) => {
    try {
        const newGame = new XoGame(req.body);
        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get all records
app.get('/api/v1/history', async (req, res) => {
    try {
        const games = await XoGame.find().sort({ createdAt: -1 });
        res.status(200).json(games);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});