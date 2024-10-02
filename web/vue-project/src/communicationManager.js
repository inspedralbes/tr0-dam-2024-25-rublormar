export async function getPreguntes() {
    const response = await fetch('http://localhost:3000/preguntes');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
}

export async function addPregunta(pregunta) {
    console.log("AAAAAAAAAAAAAAA", pregunta);

    try {
        const response = await fetch('http://localhost:3000/preguntes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pregunta),
        });

        if (!response.ok) {
            throw new Error('Respuesta del servidor no válida');
        }

        return await response.json();

    } catch {
        console.error("Error al añadir pregunta", error);
        throw error;

    }
}

