<template>
  <div class="page-container">
    <div class="page-header">
      <h2>实验室使用记录</h2>
    </div>

    <!-- 筛选条件 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filters">
        <el-form-item label="实验室">
          <el-select v-model="filters.labId" placeholder="全部实验室" clearable @change="loadRecords">
            <el-option
              v-for="lab in labs"
              :key="lab.labId"
              :label="lab.labName"
              :value="lab.labId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="filters.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="loadRecords"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部状态" clearable @change="loadRecords">
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadRecords">查询</el-button>
          <el-button @click="resetFilters">重置</el-button>
          <el-button type="success" @click="exportExcel">导出Excel</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-number">{{ totalCount }}</div>
          <div class="stat-label">总使用次数</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-number">{{ approvedCount }}</div>
          <div class="stat-label">已通过</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-number">{{ pendingCount }}</div>
          <div class="stat-label">待审核</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-number">{{ totalHours }}</div>
          <div class="stat-label">总使用时长(小时)</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 使用记录表格 -->
    <el-card>
      <el-table :data="records" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="labName" label="实验室" width="150" />
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="userName" label="使用人" width="100" />
        <el-table-column prop="startTime" label="开始时间" width="160" />
        <el-table-column prop="endTime" label="结束时间" width="160" />
        <el-table-column prop="duration" label="时长(小时)" width="100">
          <template #default="{ row }">
            {{ calculateDuration(row.startTime, row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="purpose" label="用途" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">
              {{ statusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="loadRecords"
        @current-change="loadRecords"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { reservationApi } from '@/api/reservation'
import { labApi } from '@/api/lab'

const loading = ref(false)
const records = ref([])
const labs = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)

const filters = ref({
  labId: null,
  dateRange: null,
  status: null
})

// 统计数据
const totalCount = ref(0)
const approvedCount = ref(0)
const pendingCount = ref(0)
const totalHours = ref(0)

// 计算时长（小时）
const calculateDuration = (start, end) => {
  if (!start || !end) return 0
  const startTime = new Date(start)
  const endTime = new Date(end)
  const hours = (endTime - startTime) / (1000 * 60 * 60)
  return hours.toFixed(1)
}

// 状态标签
const statusType = (status) => {
  const map = { pending: 'warning', approved: 'success', rejected: 'danger', completed: 'info', cancelled: 'info' }
  return map[status] || 'info'
}

const statusText = (status) => {
  const map = { pending: '待审核', approved: '已通过', rejected: '已拒绝', completed: '已完成', cancelled: '已取消' }
  return map[status] || status
}

// 加载实验室列表
const loadLabs = async () => {
  const res = await labApi.getList()
  labs.value = res.data
}

// 加载使用记录
const loadRecords = async () => {
  loading.value = true
  try {
    // 获取所有预约记录
    const res = await reservationApi.getAll()
    let data = res.data || []
    
    // 按实验室筛选
    if (filters.value.labId) {
      // 需要根据设备关联实验室筛选，这里简化处理
      data = data.filter(r => r.labId === filters.value.labId)
    }
    
    // 按状态筛选
    if (filters.value.status) {
      data = data.filter(r => r.status === filters.value.status)
    }
    
    // 按日期范围筛选
    if (filters.value.dateRange && filters.value.dateRange.length === 2) {
      const startDate = new Date(filters.value.dateRange[0])
      const endDate = new Date(filters.value.dateRange[1])
      endDate.setHours(23, 59, 59)
      data = data.filter(r => {
        const recordDate = new Date(r.startTime)
        return recordDate >= startDate && recordDate <= endDate
      })
    }
    
    // 统计数据
    totalCount.value = data.length
    approvedCount.value = data.filter(r => r.status === 'approved').length
    pendingCount.value = data.filter(r => r.status === 'pending').length
    totalHours.value = data.reduce((sum, r) => {
      return sum + parseFloat(calculateDuration(r.startTime, r.endTime))
    }, 0)
    
    // 分页
    total.value = data.length
    const start = (pageNum.value - 1) * pageSize.value
    records.value = data.slice(start, start + pageSize.value)
    
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 重置筛选
const resetFilters = () => {
  filters.value = { labId: null, dateRange: null, status: null }
  pageNum.value = 1
  loadRecords()
}

// 导出Excel
const exportExcel = () => {
  // 简单导出CSV格式
  const headers = ['ID', '实验室', '设备名称', '使用人', '开始时间', '结束时间', '时长(小时)', '用途', '状态']
  const rows = records.value.map(r => [
    r.id,
    r.labName || '-',
    r.deviceName,
    r.userName,
    r.startTime,
    r.endTime,
    calculateDuration(r.startTime, r.endTime),
    r.purpose,
    statusText(r.status)
  ])
  
  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.setAttribute('download', '实验室使用记录.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}

onMounted(() => {
  loadLabs()
  loadRecords()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.filter-card {
  margin-bottom: 20px;
}

.stat-row {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
  cursor: pointer;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}
</style>