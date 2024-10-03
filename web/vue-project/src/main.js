import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';

const app = createApp(App);
app.use(PrimeVue);

//Components imports
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

//Use components

app.component('Button', Button);
app.component('InputText', InputText);

createApp(App).mount('#app')
