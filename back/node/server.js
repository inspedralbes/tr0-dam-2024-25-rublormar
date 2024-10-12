const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { spawn } = require('child_process');
const { v4: uuidv4, validate } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

let json;
const partidas = [];

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

// GET buscar pregunta por ID
app.get('/pregunta/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pregunta = json.preguntes.find(pregunta => pregunta.id === id);

    if (!pregunta) {
        return res.status(404).send('Pregunta no encontrada');
    }
    res.send(pregunta);
});

// POST crear pregunta
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
});

app.post('/partida', (req, res) => {
    const { uid, usuario } = req.body;
    const preguntes = json.preguntes;
    const partida = {
        uid: "",
        usuario: usuario,
        preguntes: []
    };

    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * preguntes.length);
        if (partida.preguntes.some(p => p.id === preguntes[randomIndex].id)) {
            i--;
        } else {
            let aux = {
                "id": preguntes[randomIndex].id,
                "pregunta": preguntes[randomIndex].pregunta,
                "respostes": [...preguntes[randomIndex].respostes],
                "resposta_correcta": preguntes[randomIndex].resposta_correcta,
                "imatge": preguntes[randomIndex].imatge
            };
            aux.respostes.sort(() => Math.random() - 0.5);
            partida.preguntes.push(aux);
        }
    }

    partida.uid = generateUniqueUUID(uid);
    partidas[partida.uid] = JSON.parse(JSON.stringify(partida));
    console.log("partidas", partidas);

    const partidaParaCliente = {
        ...partida,
        preguntes: partida.preguntes.map(p => ({
            id: p.id,
            pregunta: p.pregunta,
            respostes: p.respostes,
            imatge: p.imatge
        }))

    };

    res.send(partidaParaCliente);
});

app.post('/respuestas', (req, res) => {
    const { uid, respuestas } = req.body;
    const partida = partidas[uid];
    let date = new Date();
    let time = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear(); // Formato de fecha corregido

    if (!uid || !respuestas) {
        return res.status(400).send('Petición incorrecta');
    }

    if (partida) {
        if (!fs.existsSync('../db/' + time)) {
            fs.mkdirSync('../db/' + time);
            data = {
                dades: {
                    totalIntentosPartida: 0,
                    totalPreguntasCorrectas: 0,
                },
                dadesPreguntes: []
            };
            fs.writeFileSync('../db/' + time + '/dades.json', JSON.stringify(data));
        }

        let file = fs.readFileSync('../db/' + time + '/dades.json');
        file = JSON.parse(file);

        respuestas.forEach(respuesta => {
            const pregunta = partida.preguntes.find(p => p.id === respuesta.id);
            if (pregunta) {
                const respuestaCorrecta = pregunta.resposta_correcta;
                const respuestaUsuario = respuesta.respuesta;

                // Log para depuración
                console.log(`Pregunta ID: ${pregunta.id}, Respuesta Correcta: ${respuestaCorrecta}, Respuesta Usuario: ${respuestaUsuario}`);

                // Actualizar totalIntentosPartida
                file.dades.totalIntentosPartida++;

                // Actualizar totalPreguntasCorrectas
                if (respuestaCorrecta === respuestaUsuario) { // Asegúrate de usar === para comparación estricta
                    file.dades.totalPreguntasCorrectas++;
                }

                // Buscar o crear entrada en dadesPreguntes
                let preguntaData = file.dadesPreguntes.find(p => p.id === pregunta.id);
                if (!preguntaData) {
                    preguntaData = {
                        id: pregunta.id,
                        intentos: 0,
                        correctas: 0
                    };
                    file.dadesPreguntes.push(preguntaData);
                }

                // Actualizar intentos y correctas para la pregunta
                preguntaData.intentos++;
                if (respuestaCorrecta === respuestaUsuario) { // Asegúrate de usar === para comparación estricta
                    preguntaData.correctas++;
                }
            }
        });

        // Guardar los cambios en el archivo JSON
        fs.writeFileSync('../db/' + time + '/dades.json', JSON.stringify(file, null, 2));
    }

    console.log("respuestas recibidas de la partida con uid", uid, respuestas);
    res.status(200).send(partidas[uid]);
});

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

function generateUniqueUUID(uid) {
    if (uid == undefined || !validate(uid)) {
        uid = uuidv4();
    }
    console.log("uid", uid);
    return uid;
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});