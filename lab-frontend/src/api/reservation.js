import request from './request'

export const reservationApi = {
    getList() {
        return request.get('/api/device/list')
    },
    getAvailable() {
        return request.get('/api/device/available')
    },
    submit(userId, data) {
        return request.post(`/api/reservation/submit?userId=${userId}`, data)
    },
    getMy(userId) {
        return request.get(`/api/reservation/my/${userId}`)
    },
    getPending() {
        return request.get('/api/reservation/pending')
    },
    review(data) {
        return request.post('/api/reservation/review', data)
    },
    getAll() {
        return request.get('/api/reservation/all')
    }
}