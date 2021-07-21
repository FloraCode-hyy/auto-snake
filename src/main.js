import { createApp } from 'vue'
import App from './App.vue'
import installElementPlus from './plugins/element'
import './assets/font/iconfont.css'
import './assets/font/iconfont'

const app = createApp(App)
installElementPlus(app)
app.mount('#app')