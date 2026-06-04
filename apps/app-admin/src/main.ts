import { createApp } from 'vue'
import ToastService from 'primevue/toastservice'
import { useThemeStore } from '@/stores/theme.store'
import './assets/main.css'

// 图标库
import 'primeicons/primeicons.css'

import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/Aura'
import ConfirmationService from 'primevue/confirmationservice'

import App from './App.vue'
import router from './router'
import { definePreset } from '@primevue/themes'

const app = createApp(App)

const theme = definePreset(Aura, {
  components: {
    breadcrumb: {
      root: {
        padding: '0.5rem 1rem',
      },
    },
  },
})
app.use(createPinia())

const themeStore = useThemeStore()
await themeStore.loadDynamicRoutes(router)

app.use(router)

app.use(PrimeVue, {
  theme: {
    preset: theme,
  },
})
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')
