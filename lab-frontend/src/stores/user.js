import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null
    }),
    getters: {
        isLoggedIn: (state) => !!state.user,
        isAdmin: (state) => state.user?.role === 'admin',
        isTeacher: (state) => state.user?.role === 'teacher',
        isStudent: (state) => state.user?.role === 'student'
    },
    actions: {
        setUser(user) {
            this.user = user
            localStorage.setItem('user', JSON.stringify(user))
        },
        logout() {
            this.user = null
            localStorage.removeItem('user')
        },
        loadFromStorage() {
            const user = localStorage.getItem('user')
            if (user) {
                this.user = JSON.parse(user)
            }
        }
    }
})
