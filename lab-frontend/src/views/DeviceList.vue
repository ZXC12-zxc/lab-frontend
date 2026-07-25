<template>
  <div class="page-container">
    <div class="page-header">
      <h2>设备列表</h2>
      <div class="filters">
        <el-select v-model="selectedLab" placeholder="选择实验室" clearable @change="loadDevices">
          <el-option
            v-for="lab in labs"
            :key="lab.id"
            :label="lab.labName"
            :value="lab.labId"
          />
        </el-select>
        <el-input
          v-model="searchKeyword"
          placeholder="搜索设备"
          style="width: 200px"
          clearable
          @clear="loadDevices"
          @keyup.enter="searchDevice"
        >
          <template #append>
            <el-button @click="searchDevice">搜索</el-button>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 设备卡片列表 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="device in displayDevices" :key="device.id">
        <el-card class="device-card" shadow="hover" @click="goDetail(device.id)">
          <div class="device-icon">
            <el-icon :size="48"><Monitor /></el-icon>
          </div>
          <div class="device-name">{{ device.name }}</div>
          <div class="device-model">{{ device.model }}</div>
          <div class="device-lab">
            <el-icon><Location /></el-icon>
            {{ device.labName || device.labId }}
          </div>
          <div class="device-info">
            <el-tag :type="(device.availableCount || device.totalCount) > 0 ? 'success' : 'danger'" size="small">
              可用: {{ device.availableCount || device.totalCount }}
            </el-tag>
            <el-tag :type="device.status === 'idle' ? 'success' : 'warning'" size="small">
              {{ device.status === 'idle' ? '空闲' : '使用中' }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { deviceApi } from '@/api/device'
import { labApi } from '@/api/lab'
import { Monitor, Location } from '@element-plus/icons-vue'

const router = useRouter()
const devices = ref([])
const labs = ref([])
const selectedLab = ref(null)
const searchKeyword = ref('')

const displayDevices = computed(() => {
  let result = devices.value
  if (selectedLab.value) {
    result = result.filter(d => d.labId === selectedLab.value)
  }
  if (searchKeyword.value) {
    result = result.filter(d => 
      d.name.includes(searchKeyword.value) || d.model?.includes(searchKeyword.value)
    )
  }
  return result
})

const loadLabs = async () => {
  const res = await labApi.getList()
  labs.value = res.data
}

const loadDevices = async () => {
  try {
    const res = await deviceApi.getList()
    devices.value = res.data
  } catch (error) {
    ElMessage.error('加载失败')
  }
}

const searchDevice = () => {
  // computed 会自动处理
}

const goDetail = (deviceId) => {
  router.push(`/device/${deviceId}`)
}

onMounted(() => {
  loadLabs()
  loadDevices()
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

.device-card {
  cursor: pointer;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  margin-bottom: 20px;
}

.device-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.device-icon {
  margin: 20px 0;
  color: #409EFF;
}

.device-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.device-model {
  color: #999;
  font-size: 14px;
  margin-bottom: 15px;
}

.device-info {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}
</style>
