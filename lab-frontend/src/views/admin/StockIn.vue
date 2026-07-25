<template>
  <div class="page-container">
    <div class="page-header">
      <h2>入库登记</h2>
    </div>

    <el-card>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="选择耗材" prop="consumableId">
          <el-select v-model="form.consumableId" placeholder="请选择耗材" style="width: 100%">
            <el-option
              v-for="item in consumables"
              :key="item.id"
              :label="`${item.name} (当前库存: ${item.stock}${item.unit})`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="入库数量" prop="quantity">
          <el-input-number v-model="form.quantity" :min="1" :max="1000" style="width: 100%" />
        </el-form-item>

        <el-form-item label="入库类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="purchase">采购入库</el-radio>
            <el-radio label="return">归还入库</el-radio>
            <el-radio label="adjust">盘点调整</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注信息" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleStockIn" :loading="loading">确认入库</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 入库记录 -->
    <el-card style="margin-top: 20px">
      <template #header>
        <span>入库记录</span>
        <el-button type="primary" link @click="loadRecords" style="float: right">刷新</el-button>
      </template>
      <el-table :data="records" stripe>
        <el-table-column prop="consumableName" label="耗材名称" />
        <el-table-column prop="quantity" label="入库数量" width="100" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="typeTag(row.type)">{{ typeText(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operatorName" label="操作人" width="120" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createTime" label="入库时间" width="180" />
      </el-table>
      <el-empty v-if="records.length === 0" description="暂无入库记录" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { consumableApi } from '@/api/consumable'
import { stockInApi } from '@/api/stock'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const consumables = ref([])
const records = ref([])
const loading = ref(false)
const formRef = ref()

const form = ref({
  consumableId: null,
  quantity: 1,
  type: 'purchase',
  remark: ''
})

const rules = {
  consumableId: [{ required: true, message: '请选择耗材', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }]
}

const typeTag = (type) => {
  const map = { purchase: 'success', return: 'info', adjust: 'warning' }
  return map[type] || 'info'
}

const typeText = (type) => {
  const map = { purchase: '采购入库', return: '归还入库', adjust: '盘点调整' }
  return map[type] || type
}

const loadConsumables = async () => {
  const res = await consumableApi.getList()
  consumables.value = res.data
}

const loadRecords = async () => {
  const res = await stockInApi.getRecords()
  records.value = res.data
}

const handleStockIn = async () => {
  await formRef.value.validate()
  loading.value = true
  try {
    await stockInApi.submit({
      consumableId: form.value.consumableId,
      quantity: form.value.quantity,
      type: form.value.type,
      remark: form.value.remark
    }, userStore.user.id, userStore.user.username)
    ElMessage.success('入库成功')
    resetForm()
    loadConsumables()
    loadRecords()
  } catch (error) {
    ElMessage.error('入库失败')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    consumableId: null,
    quantity: 1,
    type: 'purchase',
    remark: ''
  }
}

onMounted(() => {
  loadConsumables()
  loadRecords()
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

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}
</style>