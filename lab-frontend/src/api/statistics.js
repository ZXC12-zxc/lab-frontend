import request from './request'

export const statisticsApi = {
    getAll() {
        return request.get('/api/statistics/all')
    },
    getDeviceUsage() {
        return request.get('/api/statistics/device-usage')
    },
    getReservationStat() {
        return request.get('/api/statistics/reservation-stat')
    },
    getReservationTrend() {
        return request.get('/api/statistics/reservation-trend')
    },
    getUsageByCategory() {
        return request.get('/api/statistics/usage-by-category')
    }
}