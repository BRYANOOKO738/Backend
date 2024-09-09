const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const port = 3031;
const app = express();

app.use(bodyParser.json());
app.use(cors());

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "credentials",
});

con.connect(err => {
    if (err) throw err;
    console.log('Database connected successfully');
});

app.get('/', (req, res) => {
    res.send('Welcome to the Home Page');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    con.query(query, [username, password], (err) => {
        if (err) {
            res.status(500).send('Error during sign up: ' + err.message);
        } else {
            res.status(200).send('Sign up successful');
        }
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const query = 'SELECT * FROM users WHERE username=? AND password=?';
    con.query(query, [username, password], (err, result) => {
        if (err) {
            res.status(500).send('Error during sign in: ' + err.message);
        } else if (result.length > 0) {
            res.status(200).send('Login successful');
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
