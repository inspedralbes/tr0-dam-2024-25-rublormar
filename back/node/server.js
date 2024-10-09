const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

let json;

fs.readFile('../db/dades.json', 'utf8', (err, data) => {
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

function sobreescribirJSON(json, callback) {
    fs.writeFile('../db/dades.json', JSON.stringify(json, null, 2), (err) => {
        if (err) {
            console.error('Error escribiendo el archivo JSON');
            return callback(err);
        }
        callback(null);

    });
}

app.post('/preguntes', (req, res) => {
    const novaPregunta = req.body;

    const idNovaPregunta = json.preguntes.length > 0 ? json.preguntes[json.preguntes.length - 1].id + 1 : 1;
    novaPregunta.id = idNovaPregunta;

    if (!novaPregunta.pregunta || !novaPregunta.respostes || 3 < novaPregunta.resposta_correcta || novaPregunta.resposta_correcta < 0) {
        return res.status(400).send('Pregunta invalida');
    }

    json.preguntes.push(novaPregunta);

    // Escribir de nuevo el archivo JSON
    sobreescribirJSON(json, (err) => {
        if (err) {
            return res.status(500).send('Error escribiendo el archivo');
        }
        res.status(201).send(novaPregunta); // Enviar la nueva pregunta como respuesta
    });
});

app.put('/update', (req, res) => {
    const preguntaEditada = req.body;

    const index = json.preguntes.findIndex(p => p.id === preguntaEditada.id);

    if (index === -1) {
        return res.status(404).send('Pregunta no encontrada');
    }

    json.preguntes[index] = preguntaEditada;


    // Escribir de nuevo el archivo JSON
    sobreescribirJSON(json, (err) => {
        if (err) {
            return res.status(500).send('Error escribiendo el archivo');
        }
        res.status(200).send({ id: preguntaEditada.id, ...preguntaEditada }); // Enviar la pregunta editada como respuesta
    });
});

app.delete('/delete', (req, res) => {
    const id = req.body.id;

    const index = json.preguntes.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).send('Pregunta no encontrada');
    }

    json.preguntes.splice(index, 1);

    // Escribir de nuevo el archivo JSON
    sobreescribirJSON(json, (err) => {
        if (err) {
            return res.status(500).send('Error escribiendo el archivo');
        }
        res.status(200).send({ id }); // Enviar la pregunta eliminada como respuesta
    });

})

app.get('/datos', (req, res) => {
    const process = spawn('py', ['../python/estadistica.py']);

    let pData = '';

    process.stdout.on('data', (data) => {
        pData = data.toString();
        console.log(data.toString());
    });

    process.stderr.on('data', (error) => {
        console.error(`Error: ${error}`);
    });

    process.on('close', (code) => {
        console.log(`Proceso terminado con código ${code}`);
        res.send(pData);
    });

});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});