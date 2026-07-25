<template>
  <div class="page-container">
    <div class="page-header">
      <h2>我的预约</h2>
      <el-radio-group v-model="statusFilter" @change="loadReservations">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="pending">待审核</el-radio-button>
        <el-radio-button label="approved">已通过</el-radio-button>
        <el-radio-button label="rejected">已拒绝</el-radio-button>
      </el-radio-group>
    </div>

    <el-card>
      <el-table :data="filteredReservations" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="startTime" label="开始时间" width="180" />
        <el-table-column prop="endTime" label="结束时间" width="180" />
        <el-table-column prop="purpose" label="用途" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">
              {{ statusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="filteredReservations.length === 0" description="暂无预约记录" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { deviceApi } from '@/api/device'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const reservations = ref([])
const statusFilter = ref('all')

const statusType = (status) => {
  const map = { pending: 'warning', approved: 'success', rejected: 'danger', completed: 'info', cancelled: 'info' }
  return map[status] || 'info'
}

const statusText = (status) => {
  const map = { pending: '待审核', approved: '已通过', rejected: '已拒绝', completed: '已完成', cancelled: '已取消' }
  return map[status] || status
}

const filteredReservations = computed(() => {
  if (statusFilter.value === 'all') return reservations.value
  return reservations.value.filter(r => r.status === statusFilter.value)
})

const loadReservations = async () => {
  try {
    const res = await deviceApi.getMyReservations(userStore.user.id)
    reservations.value = res.data
  } catch (error) {
    ElMessage.error('加载失败')
  }
}

onMounted(() => {
  loadReservations()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}
</style>
