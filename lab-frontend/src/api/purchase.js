import request from './request'

export const purchaseApi = {
    submit(data) {
        return request.post('/api/consumable/purchase-request', data)
    },
    getList() {
        return request.get('/api/consumable/purchase-requests')
    },
    review(id, status) {
        return request.post('/api/consumable/purchase-review', { requestId: id, status })
    }
}