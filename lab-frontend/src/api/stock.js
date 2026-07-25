import request from './request'

export const stockInApi = {
    submit(data, operatorId, operatorName) {
        return request.post(`/api/consumable/stock-in?operatorId=${operatorId}&operatorName=${operatorName}`, data)
    },
    getRecords() {
        return request.get('/api/consumable/stock-in-records')
    }
}