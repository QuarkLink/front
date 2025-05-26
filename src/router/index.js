import { createRouter, createWebHistory } from 'vue-router'
import UserPanel from '../views/UserPanel.vue'
import AdminPanel from '../views/AdminPanel.vue'

const routes = [
    {
        path: '/',
        name: 'UserPanel',
        component: UserPanel
    },
    {
        path: '/admin',
        name: 'AdminPanel',
        component: AdminPanel
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router 
