<template>
  <div class="page-container">
    <div class="page-header">
      <h2>耗材列表</h2>
      <el-input
        v-model="searchKeyword"
        placeholder="搜索耗材"
        style="width: 280px"
        clearable
        @clear="loadConsumables"
        @keyup.enter="searchConsumable"
      >
        <template #append>
          <el-button @click="searchConsumable">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>
    </div>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in displayList" :key="item.id">
        <el-card class="consumable-card" shadow="hover" @click="goApply(item.id)">
          <div class="consumable-icon" :class="{ warning: item.stock < item.warningThreshold }">
            <el-icon :size="40"><Goods /></el-icon>
          </div>
          <div class="consumable-name">{{ item.name }}</div>
          <div class="consumable-spec">{{ item.category }} / {{ item.model }}</div>
          <div class="consumable-stock">
            <span class="stock-label">库存</span>
            <span class="stock-value" :class="{ low: item.stock < item.warningThreshold }">
              {{ item.stock }}{{ item.unit }}
            </span>
          </div>
          <div class="consumable-location">
            <el-icon><Location /></el-icon>
            {{ item.location || '未设置' }}
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
import { consumableApi } from '@/api/consumable'
import { Goods, Search, Location } from '@element-plus/icons-vue'

const router = useRouter()
const consumables = ref([])
const searchKeyword = ref('')

const displayList = computed(() => {
  if (!searchKeyword.value) return consumables.value
  return consumables.value.filter(c =>
    c.name.includes(searchKeyword.value) || c.category?.includes(searchKeyword.value)
  )
})

const loadConsumables = async () => {
  try {
    const res = await consumableApi.getList()
    consumables.value = res.data
  } catch (error) {
    ElMessage.error('加载失败')
  }
}

const searchConsumable = () => {
  // computed 会自动处理，只需触发重新计算
}

const goApply = (id) => {
  router.push(`/my-applications?consumableId=${id}`)
}

onMounted(() => {
  loadConsumables()
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

.consumable-card {
  cursor: pointer;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  margin-bottom: 20px;
}

.consumable-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.consumable-icon {
  margin: 20px 0;
  color: #67C23A;
}

.consumable-icon.warning {
  color: #F56C6C;
}

.consumable-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.consumable-spec {
  color: #999;
  font-size: 13px;
  margin-bottom: 15px;
}

.consumable-stock {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 10px;
}

.stock-label {
  font-size: 14px;
  color: #666;
}

.stock-value {
  font-size: 24px;
  font-weight: bold;
  color: #67C23A;
}

.stock-value.low {
  color: #F56C6C;
}

.consumable-location {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 10px;
  border-top: 1px solid #eee;
  margin-top: 10px;
}
</style>
