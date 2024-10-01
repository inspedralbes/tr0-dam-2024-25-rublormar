<template>
    <div>
        TR0
    </div>
</template>

<script>
    import { reactive, ref, onMounted } from 'vue';
    import { getPreguntes } from '../communicationManager.js';
    
    const preguntes = ref("");
    const editarPregunta = ref({
        id: null,
        pregunta: '',
        respostes: ['', '', '', ''],
        resposta_correcta: 0,
        imatge: ''

    });


    onMounted( async () => {
       preguntes.value = await getPreguntes();  
    });

    

</script>

<style lang="scss" scoped>

</style>