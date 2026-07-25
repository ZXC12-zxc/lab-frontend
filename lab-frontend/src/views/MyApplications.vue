<template>
  <div class="page-container">
    <div class="page-header">
      <h2>我的申请</h2>
      <el-button type="primary" @click="showApplyDialog = true">
        <el-icon><Plus /></el-icon>
        申请耗材
      </el-button>
    </div>

    <!-- 申请表单对话框 -->
    <el-dialog v-model="showApplyDialog" title="申请耗材" width="500px">
      <el-form :model="applyForm" :rules="applyRules" ref="applyFormRef" label-width="80px">
        <el-form-item label="耗材" prop="consumableId">
          <el-select v-model="applyForm.consumableId" placeholder="请选择耗材" style="width: 100%">
            <el-option
              v-for="item in consumables"
              :key="item.id"
              :label="`${item.name} (库存: ${item.stock}${item.unit})`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input-number v-model="applyForm.quantity" :min="1" :max="100" style="width: 100%" />
        </el-form-item>
        <el-form-item label="用途" prop="purpose">
          <el-input v-model="applyForm.purpose" type="textarea" :rows="3" placeholder="请填写用途" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showApplyDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">提交申请</el-button>
      </template>
    </el-dialog>

    <!-- 申请列表 -->
    <el-card>
      <el-table :data="applications" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="consumableName" label="耗材名称" />
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="purpose" label="用途" />
        <el-table-column prop="applyTime" label="申请时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">
              {{ statusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="applications.length === 0" description="暂无申请记录" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { consumableApi } from '@/api/consumable'
import { useUserStore } from '@/stores/user'
import { Plus } from '@element-plus/icons-vue'

const route = useRoute()
const userStore = useUserStore()
const applications = ref([])
const consumables = ref([])
const showApplyDialog = ref(false)
const submitting = ref(false)
const applyFormRef = ref()

const applyForm = ref({
  consumableId: null,
  quantity: 1,
  purpose: ''
})

const applyRules = {
  consumableId: [{ required: true, message: '请选择耗材', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  purpose: [{ required: true, message: '请填写用途', trigger: 'blur' }]
}

const statusType = (status) => {
  const map = { pending: 'warning', approved: 'success', rejected: 'danger', completed: 'info' }
  return map[status] || 'info'
}

const statusText = (status) => {
  const map = { pending: '待审核', approved: '已通过', rejected: '已拒绝', completed: '已领取' }
  return map[status] || status
}

const loadApplications = async () => {
  try {
    const res = await consumableApi.getMyApplications(userStore.user.id)
    console.log('申请列表数据:', res.data)
    applications.value = res.data
  } catch (error) {
    ElMessage.error('加载失败')
    console.error(error)
  }
}

const loadConsumables = async () => {
  try {
    const res = await consumableApi.getList()
    consumables.value = res.data
  } catch (error) {
    ElMessage.error('加载耗材失败')
  }
}

const handleSubmit = async () => {
  try {
    await applyFormRef.value.validate()
  } catch (error) {
    console.log('表单验证失败', error)
    return
  }
  
  submitting.value = true
  try {
    const res = await consumableApi.submit(userStore.user.id, {
      consumableId: applyForm.value.consumableId,
      quantity: applyForm.value.quantity,
      purpose: applyForm.value.purpose
    })
    console.log('提交结果:', res)
    ElMessage.success('申请已提交，请等待审核')
    showApplyDialog.value = false
    applyForm.value = { consumableId: null, quantity: 1, purpose: '' }
    loadApplications()
  } catch (error) {
    console.error('提交错误:', error)
    ElMessage.error(error.message || '提交失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadApplications()
  loadConsumables()

  // 如果URL带了consumableId，自动打开申请对话框
  if (route.query.consumableId) {
    applyForm.value.consumableId = parseInt(route.query.consumableId)
    showApplyDialog.value = true
  }
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