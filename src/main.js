import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia';
import { useAuthStore } from './store/auth';

const app = createApp(App)



router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.token != null;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else {
        if (to.meta.level && authStore.level < to.meta.level) {
            next('/')
        } else {
            next();
        }
    }
});

app.use(router)
app.use(createPinia())
app.mount('#app')
