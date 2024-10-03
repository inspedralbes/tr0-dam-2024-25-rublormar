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
        console.log("bbbbbbb", response);

        if (!response.ok) {
            throw new Error('Respuesta del servidor no válida');
        }

        return await response.json();

    } catch {
        console.error("Error al añadir pregunta", error);
        throw error;

    }
}

export async function editarPregunta(pregunta) {
    try{
        const response = await fetch('http://localhost:3000/editar', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pregunta),
        });

        if(!response.ok){
            throw new Error('Respuesta del servidor no válida');
        }

        return await response.json();

    }catch{
        console.error("Error al editar pregunta", error);
        throw error;
    }

}

export async function borrarPregunta(id) {
    try{
        const response = await fetch('http://localhost:3000/borrar', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id}),
        });

        if(!response.ok){
            throw new Error('Respuesta del servidor no válida');
        }

        return await response.json();

    }catch{
        console.error("Error al borrar pregunta", error);
        throw error;
    }
}

export async function getPythonDatos() {
    try {
        const responsePy = await fetch('http://localhost:3000/datos');

        if (!responsePy.ok) {
            throw new Error('Network response was not ok');
        }

        const dataPy = await responsePy.text();
        return dataPy;

    } catch (error) {
        console.error("Error fetching Python data", error);
        throw error;
    }



}

