<template>
  <Toolbar>
    <template #start>
      <button
        class="pi pi-plus mr-2 bg-blue-500 text-white py-2 px-3 rounded"
        severity="secondary"
        @click="buttonCrearPregunta = true"
        :disabled="buttonCrearPregunta"
      >
        Crear Pregunta
      </button>
      <button
        class="pi pi-chart-bar bg-gray-500 text-white py-2 px-3 rounded"
        @click="callgetPythonDatos"
      >
        Estadistiques
      </button>
    </template>
    <template #end>
      <InputText class="bg-gray-100 py-2 px-3 rounded" placeholder="Search" />
    </template>
  </Toolbar>
  <div class="flex flex-col items-center gap-5 p-0 m-0">
    <div v-if="pythonDatos"></div>
    <div>
      <div
        v-for="pregunta in sortedPreguntes"
        :key="pregunta.id"
        :class="[
          'mb-8 p-4 rounded-lg w-full max-w-2xl relative',
          pregunta.isNew ? 'border-orange-500' : 'border-gray-400',
        ]"
        :style="{ borderWidth: '1px' }"
      >
        <p
          v-if="pregunta.isNew"
          class="absolute top-0 left-0 bg-orange-500 text-white text-xs px-2 py-1 rounded-br-lg"
        >
          new
        </p>
        <p class="font-bold">{{ pregunta.pregunta }}</p>
        <ul class="list-none p-0">
          <li
            v-for="(resposta, index) in pregunta.respostes"
            :key="index"
            :class="{
              'bg-green-500 text-white': index === pregunta.resposta_correcta,
              'bg-gray-200': index !== pregunta.resposta_correcta,
            }"
            class="mb-1 p-2 border border-gray-300 rounded"
          >
            {{ resposta }}
          </li>
        </ul>
        <div>
          <button
            class="bg-green-500 text-white py-2 px-4 rounded mr-2"
            @click="callEditarPregunta(pregunta)"
          >
            Editar
          </button>
          <button
            class="bg-red-500 text-white py-2 px-4 rounded"
            @click="confirmDeletePregunta(pregunta)"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <Dialog
      v-model:visible="eliminarPreguntaDialog"
      header="Eliminar Pregunta"
      modal
      :draggable="false"
      class="rounded-lg"
    >
      <span>¿Seguro que quieres eliminar la pregunta?</span>
      <div class="flex justify-end mt-4">
        <button
          label="Cancelar"
          icon="pi pi-times"
          class="bg-gray-300 text-gray-800 py-2 px-4 rounded mr-2 hover:bg-gray-400"
          @click="eliminarPreguntaDialog = false"
        >
          No
        </button>
        <button
          label="Eliminar"
          icon="pi pi-check"
          class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          @click="callDeletePregunta"
        >
          Si
        </button>
      </div>
    </Dialog>

    <Dialog
      v-model:visible="buttonCrearPregunta"
      header="Nova Pregunta"
      modal
      :draggable="false"
      class="rounded-lg"
      @hide="cleanForm"
    >
      <div class="w-full max-w-2xl">
        <div>
          <input
            v-model="preguntaNovaData.pregunta"
            placeholder="Pregunta"
            class="border border-gray-300 rounded p-2 w-full"
            required
          />
        </div>
        <div>
          <input
            v-for="(resposta, index) in preguntaNovaData.respostes"
            :key="index"
            v-model="preguntaNovaData.respostes[index]"
            placeholder="Resposta"
            class="border border-gray-300 rounded p-2 w-full my-2"
            required
          />
        </div>
        <div>
          <select
            v-model.number="preguntaNovaData.resposta_correcta"
            class="border border-gray-300 rounded p-2 w-full"
          >
            <option
              v-for="(resposta, index) in preguntaNovaData.respostes"
              :key="index"
              :value="index"
            >
              {{ index }}
            </option>
          </select>
        </div>
        <button
          class="bg-blue-500 text-white py-2 px-4 rounded"
          @click="mostrarDatosNovaPregunta"
        >
          Guardar Pregunta
        </button>
        <button
          class="bg-red-500 text-white py-2 px-4 rounded ml-2"
          @click="buttonCrearPregunta = false"
        >
          Cancelar
        </button>
      </div>
    </Dialog>

    <Dialog
      v-model:visible="buttonEditarPregunta"
      header="Editar Pregunta"
      modal
      :draggable="false"
      class="rounded-lg"
      @hide="cleanForm"
    >
      <div class="w-full max-w-2xl">
        <div>
          <input
            v-model="editarPreguntaData.pregunta"
            placeholder="Pregunta"
            class="border border-gray-300 rounded p-2 w-full"
            required
          />
        </div>
        <div>
          <input
            v-for="(resposta, index) in editarPreguntaData.respostes"
            :key="index"
            v-model="editarPreguntaData.respostes[index]"
            placeholder="Resposta"
            class="border border-gray-300 rounded p-2 w-full my-2"
            required
          />
        </div>
        <div>
          <select
            v-model.number="editarPreguntaData.resposta_correcta"
            class="border border-gray-300 rounded p-2 w-full"
          >
            <option
              v-for="(resposta, index) in editarPreguntaData.respostes"
              :key="index"
              :value="index"
            >
              {{ index }}
            </option>
          </select>
        </div>
        <button
          class="bg-blue-500 text-white py-2 px-4 rounded"
          @click="guardarPreguntaEditada"
        >
          Guardar Cambios
        </button>
        <button
          class="bg-red-500 text-white py-2 px-4 rounded ml-2"
          @click="buttonEditarPregunta = false"
        >
          Cancelar
        </button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import {
  getPreguntes,
  addPregunta,
  getPythonDatos,
  editarPregunta,
  eliminarPregunta,
} from "../communicationManager.js";

const preguntes = ref([]);
const buttonCrearPregunta = ref(false);
const buttonEditarPregunta = ref(false);
const eliminarPreguntaDialog = ref(false);
const pythonDatos = ref(null);
const preguntaAEliminar = ref(null);

const preguntaNovaData = ref({
  pregunta: "",
  respostes: ["", "", "", ""],
  resposta_correcta: 0,
  imatge: "",
});

const editarPreguntaData = ref({
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
  console.log("Pregunta Nova:", preguntaNovaData.value);
  await crearPregunta();
};

const crearPregunta = async () => {
  try {
    // Eliminar la propiedad isNew de todas las preguntas
    preguntes.value.forEach((pregunta) => {
      pregunta.isNew = false;
    });

    // Añadir la nueva pregunta con la propiedad isNew
    const novaPregunta = await addPregunta({
      ...preguntaNovaData.value,
      isNew: true,
    });
    preguntes.value.push(novaPregunta); // Añadir al final del array
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

const callEditarPregunta = (pregunta) => {
  editarPreguntaData.value = { ...pregunta };
  buttonEditarPregunta.value = true;
};

const guardarPreguntaEditada = async () => {
  try {
    const preguntaEditada = await editarPregunta(editarPreguntaData.value);
    const index = preguntes.value.findIndex((p) => p.id === preguntaEditada.id);
    preguntes.value[index] = preguntaEditada;
    buttonEditarPregunta.value = false;
    editarPreguntaData.value = {};
  } catch (error) {
    console.error("Error editant pregunta:", error);
  }
};

const confirmDeletePregunta = (pregunta) => {
  eliminarPreguntaDialog.value = true;
  preguntaAEliminar.value = pregunta;
};

const callDeletePregunta = async () => {
  try {
    await eliminarPregunta(preguntaAEliminar.value);
    preguntes.value = preguntes.value.filter(
      (p) => p.id !== preguntaAEliminar.value.id
    );
    eliminarPreguntaDialog.value = false;
  } catch (error) {
    console.error("Error eliminant pregunta:", error);
  }
};

const cleanForm = () => {
  preguntaNovaData.value = {
    pregunta: "",
    respostes: ["", "", "", ""],
    resposta_correcta: 0,
    imatge: "",
  };
  editarPreguntaData.value = {
    pregunta: "",
    respostes: ["", "", "", ""],
    resposta_correcta: 0,
    imatge: "",
  };
  buttonCrearPregunta.value = false;
  buttonEditarPregunta.value = false;
};

// Computed property to sort questions
const sortedPreguntes = computed(() => {
  return [...preguntes.value].sort((a, b) => b.id - a.id);
});
</script>