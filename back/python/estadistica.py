import json
route='../db/dades.json'

with open(route) as file:
    data = json.load(file)

for pregunta in data['preguntes']:
    print(pregunta['pregunta'])
    for i, resposta in enumerate(pregunta['respostes']):
        if i== pregunta['resposta_correcta']:
            print(resposta, ' <--- correcta')
        else:
            print(resposta)