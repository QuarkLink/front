import { createRouter, createWebHistory } from 'vue-router'
import UserPanel from '../views/UserPanel.vue'
import AdminPanel from '../views/AdminPanel.vue'
import LoginPage from '../views/LoginPage.vue'

const routes = [
    {
        path: '/',
        name: 'UserPanel',
        component: UserPanel
    },
    {
        path: '/admin',
        name: 'AdminPanel',
        component: AdminPanel,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
    // 检查路由是否需要登录权限
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // 检查用户是否已登录
        const token = localStorage.getItem('admin_token')
        if (!token) {
            // 未登录，跳转到登录页面，并传递当前路由作为重定向目标
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        } else {
            // 已登录，允许访问
            next()
        }
    } else {
        // 不需要登录权限的路由，直接放行
        next()
    }
})

export default router 
