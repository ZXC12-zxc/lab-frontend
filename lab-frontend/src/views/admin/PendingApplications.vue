<template>
  <div class="page-container">
    <div class="page-header">
      <h2>待审核耗材申请</h2>
      <el-radio-group v-model="statusFilter" @change="loadApplications">
        <el-radio-button label="pending">待审核</el-radio-button>
        <el-radio-button label="approved">已通过</el-radio-button>
        <el-radio-button label="rejected">已拒绝</el-radio-button>
        <el-radio-button label="all">全部</el-radio-button>
      </el-radio-group>
    </div>

    <el-card>
      <el-table :data="displayList" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="consumableName" label="耗材名称" />
        <el-table-column prop="userName" label="申请人" />
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="purpose" label="用途" />
        <el-table-column prop="applyTime" label="申请时间" width="160" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">
              {{ statusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" v-if="statusFilter === 'pending'">
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
      <el-empty v-if="displayList.length === 0" description="暂无申请记录" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { consumableApi } from '@/api/consumable'

const applications = ref([])
const statusFilter = ref('pending')

const statusType = (status) => {
  const map = { pending: 'warning', approved: 'success', rejected: 'danger', completed: 'info' }
  return map[status] || 'info'
}

const statusText = (status) => {
  const map = { pending: '待审核', approved: '已通过', rejected: '已拒绝', completed: '已领取' }
  return map[status] || status
}

const displayList = computed(() => {
  if (statusFilter.value === 'all') return applications.value
  return applications.value.filter(item => item.status === statusFilter.value)
})

const loadApplications = async () => {
  try {
    let res
    if (statusFilter.value === 'pending') {
      res = await consumableApi.getPending()
    } else {
      res = await consumableApi.getAll()
    }
    applications.value = res.data
  } catch (error) {
    ElMessage.error('加载失败')
    console.error(error)
  }
}

const handleReview = async (id, status) => {
  const action = status === 'approved' ? '通过' : '拒绝'
  try {
    await ElMessageBox.confirm(`确定要${action}这个申请吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await consumableApi.review({
      usageId: id,
      status: status,
      remark: ''
    })
    ElMessage.success(`已${action}`)
    loadApplications()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

onMounted(() => {
  loadApplications()
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