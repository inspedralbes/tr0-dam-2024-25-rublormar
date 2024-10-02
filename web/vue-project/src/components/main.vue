<template>
  <div>
    <div v-if="!buttonCrearPregunta">
      <button
        class="btn-action"
        @click="buttonCrearPregunta = !buttonCrearPregunta"
      >
        Crear Pregunta
      </button>
    </div>
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
      <select v-model="preguntaNova.resposta_correcta">
        <option
          v-for="(resposta, index) in preguntaNova.respostes"
          :key="index"
          :value="index"
        >
          {{ index }}
        </option>
      </select>
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

    <div v-for="pregunta in preguntes" :key="pregunta.id">
      <p>{{ pregunta.pregunta }}</p>
      <ul>
        <li v-for="(resposta, index) in pregunta.respostes" :key="index">
          {{ resposta }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { getPreguntes, addPregunta } from "../communicationManager.js";

const preguntes = ref([]);
const buttonCrearPregunta = ref(false);

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
    const novaPregunta = await addPregunta(preguntaNova.value);
    preguntes.value.push(novaPregunta);
    buttonCrearPregunta.value = false;
    cleanForm();
  } catch (error) {
    console.error("Error creant pregunta:", error);
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

li {
  background-color: #f8f9fa;
  margin: 5px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

p {
  font-weight: bold;
}
</style>