import request from './request'

export const deviceApi = {
    getList() {
        return request.get('/api/device/list')
    },
    getAvailable() {
        return request.get('/api/device/available')
    },
    getDetail(id) {
        return request.get(`/api/device/${id}`)
    },
    submitReservation(userId, data) {
        return request.post(`/api/reservation/submit?userId=${userId}`, data)
    },
    getMyReservations(userId) {
        return request.get(`/api/reservation/my/${userId}`)
    },
    // 添加统计方法
    getStatistics() {
        return request.get('/api/statistics/all')
    }
}
