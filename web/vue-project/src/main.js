import './assets/tailwind.css';
import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Dialog from 'primevue/dialog';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import InputText from 'primevue/inputtext';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App);

app.use(PrimeVue);

// Components imports
app.component('Dialog', Dialog);
app.component('Toolbar', Toolbar);
app.component('Button', Button);
app.component('SplitButton', SplitButton);
app.component('InputText', InputText);

app.mount('#app');