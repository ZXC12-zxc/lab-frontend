<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>待审核预约</span>
      </template>

      <el-table :data="reservations" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="userName" label="申请人" />
        <el-table-column prop="startTime" label="开始时间" width="160" />
        <el-table-column prop="endTime" label="结束时间" width="160" />
        <el-table-column prop="purpose" label="用途" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="success" size="small" @click="handleReview(row.id, 'approved')">
              通过
            </el-button>
            <el-button type="danger" size="small" @click="handleReview(row.id, 'rejected')">
              拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reservationApi } from '@/api/reservation'

const reservations = ref([])

const loadPending = async () => {
  try {
    const res = await reservationApi.getPending()
    reservations.value = res.data
  } catch (error) {
    ElMessage.error('加载失败')
  }
}

const handleReview = async (id, status) => {
  const action = status === 'approved' ? '通过' : '拒绝'
  try {
    await ElMessageBox.confirm(`确定要${action}这个预约吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await reservationApi.review({
      reservationId: id,
      status: status,
      remark: ''
    })
    ElMessage.success(`已${action}`)
    loadPending()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

onMounted(() => {
  loadPending()
})
</script>
