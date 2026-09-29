/**
 * 应用入口
 *
 * 装配顺序：Pinia → 注入 Mock 用户解析 → Router → PrimeVue → 根组件挂载
 */
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { mockStore } from './mocks/store'
import { setupPrimeVue } from './plugins/primevue'
import { setupVuescroll } from './plugins/vuescroll'
import { router } from './router'
import { useAuthStore } from './stores/auth'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// 让 auth store 能根据 userId 解析出完整 User（Mock）
const auth = useAuthStore(pinia)
auth.setUserResolver((id) => mockStore.getUser(id))

app.use(router)
setupPrimeVue(app)
setupVuescroll(app)

app.mount('#app')
