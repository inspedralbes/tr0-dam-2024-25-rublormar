const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

let json;

fs.readFile('./dades/preguntes.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error leyendo el archivo JSON');
        return;
    }
    json = JSON.parse(data);
});

app.get('/', (req, res) => {
    res.send(json);
});

app.get('/preguntes', (req, res) => {
    res.send(json.preguntes);
});

app.post('/preguntes', (req, res) => {
    const novaPregunta = req.body;

    const idNovaPregunta = json.preguntes.length > 0 ? json.preguntes[json.preguntes.length - 1].id + 1 : 1;
    novaPregunta.id = idNovaPregunta;

    if (!novaPregunta.pregunta || !novaPregunta.respostes || !novaPregunta.resposta_correcta || !novaPregunta.imatge) {
        return res.status(400).send('Pregunta invalida');
    }

    json.preguntes.push(novaPregunta);

    // Escribir de nuevo el archivo JSON
    fs.writeFile('./dades/preguntes.json', JSON.stringify(json, null, 2), (err) => {
        if (err) {
            return res.status(500).send('Error escribiendo el archivo');
        }
        res.status(201).send(novaPregunta); // Enviar la nueva pregunta como respuesta
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});