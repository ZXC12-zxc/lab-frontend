<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>个人中心</span>
      </template>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="用户名">{{ userStore.user?.username }}</el-descriptions-item>
        <el-descriptions-item label="真实姓名">{{ userStore.user?.realName || '未设置' }}</el-descriptions-item>
        <el-descriptions-item label="角色">
          <el-tag :type="roleType(userStore.user?.role)">
            {{ roleText(userStore.user?.role) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ userStore.user?.email || '未设置' }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ userStore.user?.phone || '未设置' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const roleType = (role) => {
  const map = { admin: 'danger', teacher: 'warning', student: 'success' }
  return map[role] || 'info'
}

const roleText = (role) => {
  const map = { admin: '管理员', teacher: '教师', student: '学生' }
  return map[role] || role
}
</script>
