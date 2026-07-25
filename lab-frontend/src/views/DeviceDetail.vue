<template>
  <div class="page-container">
    <div class="page-header">
      <h2>设备详情</h2>
      <el-button @click="$router.back()">返回</el-button>
    </div>

    <el-card>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="设备名称">{{ device.name }}</el-descriptions-item>
        <el-descriptions-item label="型号">{{ device.model || '-' }}</el-descriptions-item>
        <el-descriptions-item label="所属实验室">{{ device.labName || device.labId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="总数量">{{ device.totalCount }}</el-descriptions-item>
        <el-descriptions-item label="可用数量">
          <el-tag :type="device.availableCount > 0 ? 'success' : 'danger'">
            {{ device.availableCount }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="device.status === 'idle' ? 'success' : 'warning'">
            {{ device.status === 'idle' ? '空闲' : '使用中' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="开放时间" :span="2">
          <div class="open-time">{{ device.openTime || '周一至周五 8:00-18:00' }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="安全规范" :span="2">
          <div class="safety-rules">{{ device.safetyRules || '请遵守实验室管理规定，爱护设备，注意安全。' }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="设备描述" :span="2">{{ device.description || '-' }}</el-descriptions-item>
      </el-descriptions>

      <div class="action-buttons">
        <el-button type="primary" size="large" @click="goReservation" :disabled="device.availableCount <= 0">
          {{ device.availableCount > 0 ? '立即预约' : '暂不可预约' }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { deviceApi } from '@/api/device'

const router = useRouter()
const route = useRoute()
const device = ref({})

const loadDevice = async () => {
  try {
    const id = route.params.id
    const res = await deviceApi.getDetail(id)
    device.value = res.data
  } catch (error) {
    ElMessage.error('加载失败')
  }
}

const goReservation = () => {
  router.push(`/reservation?deviceId=${device.value.id}`)
}

onMounted(() => {
  loadDevice()
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
}

.open-time {
  color: #409EFF;
  font-weight: bold;
}

.safety-rules {
  color: #E6A23C;
  line-height: 1.5;
}

.action-buttons {
  margin-top: 30px;
  text-align: center;
}
</style>