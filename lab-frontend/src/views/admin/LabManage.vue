<template>
  <div class="page-container">
    <div class="page-header">
      <h2>实验室管理</h2>
      <el-button type="primary" @click="openDialog()">添加实验室</el-button>
    </div>

    <el-card>
      <el-table :data="labs" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="labId" label="实验室编号" />
        <el-table-column prop="labName" label="实验室名称" />
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="openTime" label="开放时间" />
        <el-table-column prop="contact" label="联系人" />
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="openDialog(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="实验室编号" prop="labId">
          <el-input v-model="form.labId" placeholder="请输入实验室编号" />
        </el-form-item>
        <el-form-item label="实验室名称" prop="labName">
          <el-input v-model="form.labName" placeholder="请输入实验室名称" />
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="form.location" placeholder="请输入位置" />
        </el-form-item>
        <el-form-item label="开放时间" prop="openTime">
          <el-input v-model="form.openTime" placeholder="例：周一至周五 8:00-18:00" />
        </el-form-item>
        <el-form-item label="安全规范" prop="safetyRules">
          <el-input v-model="form.safetyRules" type="textarea" :rows="3" placeholder="请填写安全规范" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { labApi } from '@/api/lab'

const labs = ref([])
const dialogVisible = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const formRef = ref()

const form = reactive({
  id: null,
  labId: '',
  labName: '',
  location: '',
  openTime: '周一至周五 8:00-18:00',
  safetyRules: '',
  contact: '',
  phone: ''
})

const rules = {
  labId: [{ required: true, message: '请输入实验室编号', trigger: 'blur' }],
  labName: [{ required: true, message: '请输入实验室名称', trigger: 'blur' }]
}

const dialogTitle = computed(() => isEdit.value ? '编辑实验室' : '添加实验室')

const loadLabs = async () => {
  try {
    const res = await labApi.getList()
    labs.value = res.data || []
    console.log('加载的实验室数据:', labs.value)
  } catch (error) {
    ElMessage.error('加载失败')
  }
}

const openDialog = (row = null) => {
  console.log('打开对话框，row:', row)
  isEdit.value = !!row
  if (row && row.id) {
    form.id = row.id
    form.labId = row.labId || ''
    form.labName = row.labName || ''
    form.location = row.location || ''
    form.openTime = row.openTime || '周一至周五 8:00-18:00'
    form.safetyRules = row.safetyRules || ''
    form.contact = row.contact || ''
    form.phone = row.phone || ''
  } else {
    form.id = null
    form.labId = ''
    form.labName = ''
    form.location = ''
    form.openTime = '周一至周五 8:00-18:00'
    form.safetyRules = ''
    form.contact = ''
    form.phone = ''
  }
  console.log('表单数据:', form)
  dialogVisible.value = true
}

const handleSave = async () => {
  await formRef.value.validate()
  saving.value = true
  try {
    if (isEdit.value) {
      await labApi.update(form)
      ElMessage.success('更新成功')
    } else {
      await labApi.add(form)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    loadLabs()
  } catch (error) {
    console.error('保存错误:', error)
    ElMessage.error('操作失败')
  } finally {
    saving.value = false
  }
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm(`确定要删除实验室"${row.labName}"吗？`, '提示', { type: 'warning' })
  await labApi.delete(row.id)
  ElMessage.success('删除成功')
  loadLabs()
}

onMounted(() => {
  loadLabs()
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