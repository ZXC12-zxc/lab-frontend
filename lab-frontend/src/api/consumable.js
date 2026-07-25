import request from './request'

export const consumableApi = {
    getList() {
        return request.get('/api/consumable/list')
    },
    getWarning() {
        return request.get('/api/consumable/warning')
    },
    submit(userId, data) {
        return request.post(`/api/consumable-usage/submit?userId=${userId}`, data)
    },
    getMyApplications(userId) {
        return request.get(`/api/consumable-usage/my/${userId}`)
    },
    getPending() {
        return request.get('/api/consumable-usage/pending')
    },
    review(data) {
        return request.post('/api/consumable-usage/review', data)
    },
    getAll() {
        return request.get('/api/consumable-usage/all')
    }
}