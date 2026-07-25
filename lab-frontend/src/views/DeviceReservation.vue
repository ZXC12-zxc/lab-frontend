<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>预约设备</span>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="设备" prop="deviceId">
          <el-select v-model="form.deviceId" placeholder="请选择设备" style="width: 100%" @change="onDeviceChange">
            <el-option
              v-for="device in devices"
              :key="device.id"
              :label="`${device.name} (可用: ${device.availableCount || device.totalCount})`"
              :value="device.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="预约数量" prop="quantity" v-if="form.deviceId">
          <el-input-number 
            v-model="form.quantity" 
            :min="1" 
            :max="maxQuantity" 
            style="width: 150px"
          />
          <span style="margin-left: 10px; color: #999;">最多可预约 {{ maxQuantity }} 个</span>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                type="datetime"
                placeholder="选择开始时间"
                style="width: 100%"
                :disabled-date="disabledDate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                placeholder="选择结束时间"
                style="width: 100%"
                :disabled-date="disabledDate"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="用途" prop="purpose">
          <el-input v-model="form.purpose" type="textarea" :rows="3" placeholder="请填写预约用途" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">提交预约</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { deviceApi } from '@/api/device'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const formRef = ref()
const submitting = ref(false)
const devices = ref([])

const form = ref({
  deviceId: null,
  quantity: 1,
  startTime: null,
  endTime: null,
  purpose: ''
})

const rules = {
  deviceId: [{ required: true, message: '请选择设备', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入预约数量', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  purpose: [{ required: true, message: '请填写用途', trigger: 'blur' }]
}

const selectedDevice = computed(() => {
  return devices.value.find(d => d.id === form.value.deviceId)
})

const maxQuantity = computed(() => {
  const count = selectedDevice.value?.availableCount || 0
  return count > 0 ? count : 1
})

const disabledDate = (time) => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)
  return time.getTime() < yesterday.getTime()
}

const onDeviceChange = () => {
  form.value.quantity = 1
}

const loadDevices = async () => {
  try {
    const res = await deviceApi.getAvailable()
    devices.value = res.data
    if (route.query.deviceId) {
      form.value.deviceId = parseInt(route.query.deviceId)
      onDeviceChange()
    }
  } catch (error) {
    ElMessage.error('加载设备失败')
  }
}

const handleSubmit = async () => {
  await formRef.value.validate()
  
  if (form.value.quantity > maxQuantity.value) {
    ElMessage.error(`最多只能预约 ${maxQuantity.value} 个`)
    return
  }
  
  submitting.value = true
  try {
    await deviceApi.submitReservation(userStore.user.id, {
      deviceId: form.value.deviceId,
      quantity: form.value.quantity,
      startTime: form.value.startTime,
      endTime: form.value.endTime,
      purpose: form.value.purpose,
      remark: ''
    })
    ElMessage.success('预约申请已提交，请等待审核')
    router.push('/my-reservations')
  } catch (error) {
    ElMessage.error(error.message || '提交失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadDevices()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}
</style>