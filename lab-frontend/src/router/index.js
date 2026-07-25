import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
    { path: '/login', name: 'Login', component: () => import('@/views/Login.vue') },
    { path: '/register', name: 'Register', component: () => import('@/views/Register.vue') },
    {
        path: '/',
        component: () => import('@/views/Layout.vue'),
        meta: { requiresAuth: true },
        children: [
            { path: '', redirect: '/dashboard' },
            { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/Dashboard.vue') },
            { path: 'devices', name: 'Devices', component: () => import('@/views/DeviceList.vue') },
            { path: 'reservation', name: 'Reservation', component: () => import('@/views/DeviceReservation.vue') },
            { path: 'my-reservations', name: 'MyReservations', component: () => import('@/views/MyReservations.vue') },
            { path: 'consumables', name: 'Consumables', component: () => import('@/views/ConsumableList.vue') },
            { path: 'my-applications', name: 'MyApplications', component: () => import('@/views/MyApplications.vue') },
            { path: 'statistics', name: 'Statistics', component: () => import('@/views/Statistics.vue') },
            { path: 'profile', name: 'Profile', component: () => import('@/views/Profile.vue') },
            { path: 'device/:id', name: 'DeviceDetail', component: () => import('@/views/DeviceDetail.vue') },
            { path: 'admin/pending-reservations', name: 'PendingReservations', component: () => import('@/views/admin/PendingReservations.vue') },
            { path: 'admin/pending-applications', name: 'PendingApplications', component: () => import('@/views/admin/PendingApplications.vue') },
            { path: 'admin/stock-in', name: 'StockIn', component: () => import('@/views/admin/StockIn.vue') },
            { path: 'admin/lab-manage', name: 'LabManage', component: () => import('@/views/admin/LabManage.vue') },
            { path: 'admin/lab-usage', name: 'LabUsageRecord', component: () => import('@/views/admin/LabUsageRecord.vue') }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from) => {
    const userStore = useUserStore()
    userStore.loadFromStorage()
    
    if (to.meta.requiresAuth && !userStore.isLoggedIn) {
        return '/login'
    }
    return true
})

export default router