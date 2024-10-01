export async function getPreguntes() {
    const response = await fetch('http://localhost:3000/preguntes');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
}

export async function addPregunta(pregunta){
    const response = await fetch('http://localhost:3000/preguntes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pregunta),
    });

    if(!response.ok){
        throw new Error('Network response was not ok');
    }

    return await response.json();
}

