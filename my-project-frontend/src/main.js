import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios";
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import 'element-plus/theme-chalk/dark/css-vars.css'

// 本地开发默认连本机后端；生产构建请设置环境变量 VITE_API_BASE（如 https://api.xxx.com）
axios.defaults.baseURL =
  import.meta.env.VITE_API_BASE || 'http://localhost:8080'
const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)

app.mount('#app')
