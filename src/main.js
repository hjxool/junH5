import { createApp } from "vue";
import App from "./App.vue";
import Varlet from '@varlet/ui'
import '@varlet/ui/es/style'
import store from './store/main.js'; 

createApp(App).use(Varlet).use(store).mount('#app')
