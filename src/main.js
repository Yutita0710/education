import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css' // Tailwind CSS
import './assets/vue-select.tailwind.css';

const app = createApp(App)
app.use(router)
app.mount('#app')
