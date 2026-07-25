import request from './request'

export const userApi = {
    login(data) {
        return request.post('/api/user/login', data)
    },
    register(data) {
        return request.post('/api/user/register', data)
    },
    getUserInfo(id) {
        return request.get(`/api/user/info/${id}`)
    },
    getUserList() {
        return request.get('/api/user/list')
    }
}
