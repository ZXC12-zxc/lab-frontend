<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside width="220px" class="aside">
      <div class="logo">
        <h3>实验室管理系统</h3>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>首页</span>
        </el-menu-item>

        <el-sub-menu index="device">
          <template #title>
            <el-icon><Monitor /></el-icon>
            <span>设备管理</span>
          </template>
          <el-menu-item index="/devices">设备列表</el-menu-item>
          <el-menu-item index="/reservation">预约设备</el-menu-item>
          <el-menu-item index="/my-reservations">我的预约</el-menu-item>
        </el-sub-menu>

       <!-- 管理员菜单 -->
<el-sub-menu index="admin" v-if="userStore.isAdmin">
  <template #title>
    <el-icon><Setting /></el-icon>
    <span>系统管理</span>
  </template>
  <el-menu-item index="/admin/lab-usage">使用记录</el-menu-item>
  <el-menu-item index="/admin/pending-reservations">待审核预约</el-menu-item>
  <el-menu-item index="/admin/pending-applications">待审核申请</el-menu-item>
  <el-menu-item index="/admin/stock-in">入库登记</el-menu-item>
  <el-menu-item index="/admin/lab-manage">实验室管理</el-menu-item>
</el-sub-menu>

        <el-sub-menu index="consumable">
          <template #title>
            <el-icon><Goods /></el-icon>
            <span>耗材管理</span>
          </template>
          <el-menu-item index="/consumables">耗材列表</el-menu-item>
          <el-menu-item index="/my-applications">我的申请</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/statistics">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据统计</span>
        </el-menu-item>

        <el-menu-item index="/profile">
          <el-icon><User /></el-icon>
          <span>个人中心</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容 -->
    <el-container>
      <el-header class="header">
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              {{ userStore.user?.realName || userStore.user?.username }}
              <el-icon><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { Odometer, Monitor, Goods, DataAnalysis, User, CaretBottom, Setting } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

const handleCommand = (command) => {
  if (command === 'logout') {
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  } else if (command === 'profile') {
    router.push('/profile')
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}
.aside {
  background-color: #304156;
}
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #2b3a4a;
}
.header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.header-right {
  margin-right: 20px;
}
.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}
.main {
  background-color: #f0f2f6;
  padding: 20px;
}
/* 侧边栏 hover 效果 */
.el-menu-item:hover {
  background-color: #263445 !important;
}

/* 菜单图标间距 */
.el-menu-item .el-icon,
.el-sub-menu .el-icon {
  margin-right: 10px;
}

/* 头部用户信息样式 */
.user-info {
  font-weight: 500;
}

/* 主内容区域动画 */
.main {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
