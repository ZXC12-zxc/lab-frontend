import request from './request'

export const labApi = {
    getList() {
        return request.get('/api/laboratory/list')
    },
    getById(id) {
        return request.get(`/api/laboratory/${id}`)
    },
    add(data) {
        return request.post('/api/laboratory/add', data)
    },
    update(data) {
        return request.put('/api/laboratory/update', data)
    },
    delete(id) {
        return request.delete(`/api/laboratory/delete/${id}`)
    }
}