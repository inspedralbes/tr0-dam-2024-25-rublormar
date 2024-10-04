<template>
  <div class="container-principal">
    <div class="container-left">
      <div v-if="!buttonCrearPregunta">
        <button
          class="btn-action"
          @click="buttonCrearPregunta = !buttonCrearPregunta"
        >
          Nova Pregunta
        </button>
        <button class="btn-action" @click="callgetPythonDatos">
          Estadistiques
        </button>
      </div>

      <div></div>
      <div v-if="pythonDatos">
        <p>{{ pythonDatos }}</p>
      </div>
      <div>
        <div v-for="pregunta in preguntes" :key="pregunta.id">
          <p>{{ pregunta.pregunta }}</p>
          <ul>
            <li
              v-for="(resposta, index) in pregunta.respostes"
              :key="index"
              :class="{
                'correct-answer': index === pregunta.resposta_correcta,
              }"
            >
              {{ resposta }}
            </li>
          </ul>
          <button class="btn-editar" @click="callEditarPregunta">Editar</button>
          <button class="btn-cancel" @click="callDeletePregunta">
            Eliminar
          </button>
        </div>
      </div>
    </div>
    <div class="container-right">
      <div v-if="buttonCrearPregunta">
        <div>
          <input
            v-model="preguntaNova.pregunta"
            placeholder="Pregunta"
            required
          />
        </div>
        <div>
          <input
            v-for="(resposta, index) in preguntaNova.respostes"
            :key="index"
            v-model="preguntaNova.respostes[index]"
            placeholder="Resposta"
            required
          />
        </div>
        <div>
          <select v-model="preguntaNova.resposta_correcta">
            <option
              v-for="(resposta, index) in preguntaNova.respostes"
              :key="index"
              :value="index"
            >
              {{ index }}
            </option>
          </select>
        </div>
        <button class="btn-action" @click="mostrarDatosNovaPregunta">
          Guardar Pregunta
        </button>
        <button
          class="btn-cancel"
          @click="
            buttonCrearPregunta = false;
            cleanForm();
          "
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import {
  getPreguntes,
  addPregunta,
  getPythonDatos,
  editarPregunta,
  eliminarPregunta,
} from "../communicationManager.js";

const preguntes = ref([]);
const buttonCrearPregunta = ref(false);
const pythonDatos = ref(null);

const preguntaNova = ref({
  pregunta: "",
  respostes: ["", "", "", ""],
  resposta_correcta: 0,
  imatge: "",
});

onMounted(async () => {
  try {
    preguntes.value = await getPreguntes();
  } catch (error) {
    console.error("Error fetching preguntas:", error);
  }
});

const mostrarDatosNovaPregunta = async () => {
  console.log("Pregunta Nova:", preguntaNova.value);
  await crearPregunta();
};

const crearPregunta = async () => {
  try {
    console.log("a");

    const novaPregunta = await addPregunta(preguntaNova.value);
    preguntes.value.push(novaPregunta);
    buttonCrearPregunta.value = false;
    cleanForm();
  } catch (error) {
    console.error("Error creant pregunta:", error);
  }
};

const callgetPythonDatos = async () => {
  try {
    pythonDatos.value = await getPythonDatos();
    console.log("Python Datos:", pythonDatos.value);
  } catch (error) {
    console.error("Error fetching python datos:", error);
  }
};

const callEditarPregunta = async (pregunta) => {
  try {
    const preguntaEditada = await editarPregunta(pregunta);
    const index = pregunta.value.findIndex((p) => p.id === preguntaEditada.id);

    preguntes.value[index] = preguntaEditada;
  } catch {
    console.error("Error editant pregunta:", error);
  }
};

const callDeletePregunta = async (pregunta) => {
  try {
    await eliminarPregunta(pregunta);
    preguntes.value = preguntes.value.filter((p) => p.id !== pregunta.id);
  } catch {
    console.error("Error eliminant pregunta:", error);
  }
};

const cleanForm = () => {
  preguntaNova.value = {
    pregunta: "",
    respostes: ["", "", "", ""],
    resposta_correcta: 0,
    imatge: "",
  };
};
</script>

<style scoped>
.container-principal {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 0%;
  width: 100%;
  margin: 0;
}
div {
  margin: 20px;
}

.btn-action {
  margin: 10px 0;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-editar {
  margin: 10px 0;
  padding: 10px 20px;
  background-color: green;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-cancel {
  margin: 10px 0;
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

input,
select {
  display: block;
  margin: 10px 0;
  padding: 10px;
  width: 100%;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

ul {
  list-style-type: none;
  padding: 0;
}

.correct-answer {
  background-color: green;
}

li {
  margin: 5px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

p {
  font-weight: bold;
}
</style>