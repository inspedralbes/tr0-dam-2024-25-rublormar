const express = require('express');
const json = require('./dades/preguntes.json');
const cors = require('cors');

const app = express();
app.use(cors());

const port = 3000;

app.get('/', (req, res) => {
    res.send(json);
});

app.get('/preguntes', (req, res) => {
    res.send(json.preguntes);
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});