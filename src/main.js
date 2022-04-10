import { createApp } from 'vue';
import App from './App.vue';

// element plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// custom
import '@/assets/style/main.scss';
import '@/assets/style/variables.scss';

createApp(App).use(ElementPlus).mount('#app');
