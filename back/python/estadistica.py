import json

route='../db/dades.json' # ruta al archivo JSON 

with open(route) as file:
    data = json.load(file) # carga el archivo JSON

for pregunta in data['preguntes']:
    print(pregunta['pregunta'])
    for i, resposta in enumerate(pregunta['respostes']):
        if i== pregunta['resposta_correcta']:
            print(resposta, ' <--- correcta')
        else:
            print(resposta)