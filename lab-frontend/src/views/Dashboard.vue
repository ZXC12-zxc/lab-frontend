<template>
  <div class="dashboard">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="welcome-content">
        <h1>欢迎回来，{{ userStore.user?.realName || userStore.user?.username }}！</h1>
        <p>今天是 {{ currentDate }}，祝您工作顺利！</p>
      </div>
      <div class="welcome-icon">
        <el-icon :size="64"><User /></el-icon>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="12" :sm="12" :md="6" v-for="stat in stats" :key="stat.label">
        <el-card class="stat-card" :body-style="{ padding: '20px' }" @click="stat.onClick">
          <div class="stat-icon" :style="{ backgroundColor: stat.color }">
            <el-icon :size="28"><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷入口 -->
    <el-card class="quick-card">
      <template #header>
        <span class="card-title">快捷入口</span>
      </template>
      <el-row :gutter="20">
        <el-col :xs="12" :sm="8" :md="6" v-for="item in quickLinks" :key="item.name">
          <div class="quick-item" @click="$router.push(item.path)">
            <el-icon :size="32"><component :is="item.icon" /></el-icon>
            <span>{{ item.name }}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 最近预约 -->
    <el-card class="recent-card">
      <template #header>
        <span class="card-title">最近预约</span>
        <el-button type="primary" link @click="$router.push('/my-reservations')">查看更多</el-button>
      </template>
      <el-table :data="recentReservations" stripe v-if="recentReservations.length > 0">
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="startTime" label="开始时间" width="180" />
        <el-table-column prop="endTime" label="结束时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-else description="暂无预约记录" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { deviceApi } from '@/api/device'
import { consumableApi } from '@/api/consumable'
import { Odometer, Goods, Calendar, Warning, Monitor, ShoppingCart, DataAnalysis, User } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const deviceCount = ref(0)
const consumableCount = ref(0)
const reservationCount = ref(0)
const warningCount = ref(0)
const recentReservations = ref([])

const currentDate = computed(() => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[date.getDay()]
  return `${year}年${month}月${day}日 ${weekday}`
})

const stats = computed(() => [
  { label: '设备总数', value: deviceCount.value, icon: 'Monitor', color: '#409EFF', onClick: () => router.push('/devices') },
  { label: '耗材种类', value: consumableCount.value, icon: 'Goods', color: '#67C23A', onClick: () => router.push('/consumables') },
  { label: '今日预约', value: reservationCount.value, icon: 'Calendar', color: '#E6A23C', onClick: () => router.push('/my-reservations') },
  { label: '库存预警', value: warningCount.value, icon: 'Warning', color: '#F56C6C', onClick: () => router.push('/consumables') }
])

const quickLinks = [
  { name: '设备列表', path: '/devices', icon: 'Monitor' },
  { name: '预约设备', path: '/reservation', icon: 'Calendar' },
  { name: '耗材列表', path: '/consumables', icon: 'ShoppingCart' },
  { name: '数据统计', path: '/statistics', icon: 'DataAnalysis' }
]

const statusType = (status) => {
  const map = { pending: 'warning', approved: 'success', rejected: 'danger', completed: 'info', cancelled: 'info' }
  return map[status] || 'info'
}

const statusText = (status) => {
  const map = { pending: '待审核', approved: '已通过', rejected: '已拒绝', completed: '已完成', cancelled: '已取消' }
  return map[status] || status
}

const loadData = async () => {
  try {
    const devices = await deviceApi.getList()
    deviceCount.value = devices.data.length

    const consumables = await consumableApi.getList()
    consumableCount.value = consumables.data.length

    const warnings = await consumableApi.getWarning()
    warningCount.value = warnings.data.length

    const reservations = await deviceApi.getMyReservations(userStore.user.id)
    recentReservations.value = reservations.data.slice(0, 5)
    reservationCount.value = reservations.data.filter(r => {
      const today = new Date().toDateString()
      return new Date(r.startTime).toDateString() === today
    }).length
  } catch (error) {
    console.error('加载数据失败', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.welcome-content h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

.welcome-content p {
  font-size: 16px;
  opacity: 0.9;
}

.welcome-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-row {
  margin-bottom: 30px;
}

.stat-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  color: white;
}

.stat-info {
  display: inline-block;
  margin-left: 20px;
  vertical-align: middle;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin-top: 5px;
}

.quick-card, .recent-card {
  margin-bottom: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
}

.quick-item {
  text-align: center;
  padding: 20px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s;
}

.quick-item:hover {
  background-color: #f5f7fa;
  transform: translateY(-3px);
}

.quick-item .el-icon {
  display: block;
  margin-bottom: 10px;
  color: #409EFF;
}

.quick-item span {
  font-size: 14px;
  color: #666;
}
</style>
