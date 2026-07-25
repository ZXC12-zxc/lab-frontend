<template>
  <div class="page-container">
    <h2 class="page-title">数据统计</h2>
    
    <el-row :gutter="20">
      <!-- 设备使用率图表 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>设备使用率统计</span>
          </template>
          <div ref="deviceChartRef" class="chart"></div>
        </el-card>
      </el-col>
      
      <!-- 预约状态统计 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>预约状态统计</span>
          </template>
          <div ref="reservationChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <!-- 近7天预约趋势 -->
      <el-col :span="24">
        <el-card class="chart-card">
          <template #header>
            <span>近7天预约趋势</span>
          </template>
          <div ref="trendChartRef" class="chart-large"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <!-- 耗材分类统计 -->
      <el-col :span="24">
        <el-card class="chart-card">
          <template #header>
            <span>耗材分类领用统计</span>
          </template>
          <div ref="categoryChartRef" class="chart-large"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { statisticsApi } from '@/api/statistics'

const deviceChartRef = ref(null)
const reservationChartRef = ref(null)
const trendChartRef = ref(null)
const categoryChartRef = ref(null)

// 设备使用率图表
const initDeviceChart = async () => {
  try {
    const res = await statisticsApi.getDeviceUsage()
    const data = res.data || []
    
    const chart = echarts.init(deviceChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: data.map(d => d.deviceName), axisLabel: { rotate: 30 } },
      yAxis: { type: 'value', name: '预约次数' },
      series: [{
        name: '预约次数',
        type: 'bar',
        data: data.map(d => d.totalReservations),
        itemStyle: { borderRadius: [5, 5, 0, 0], color: '#409EFF' }
      }]
    })
  } catch (error) {
    console.error('设备图表加载失败', error)
  }
}

// 预约状态统计饼图
const initReservationChart = async () => {
  try {
    const res = await statisticsApi.getReservationStat()
    const data = res.data || {}
    
    const chart = echarts.init(reservationChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [{
        name: '预约状态',
        type: 'pie',
        radius: '50%',
        data: [
          { name: '待审核', value: data.pending || 0, itemStyle: { color: '#E6A23C' } },
          { name: '已通过', value: data.approved || 0, itemStyle: { color: '#67C23A' } },
          { name: '已拒绝', value: data.rejected || 0, itemStyle: { color: '#F56C6C' } },
          { name: '已完成', value: data.completed || 0, itemStyle: { color: '#909399' } },
          { name: '已取消', value: data.cancelled || 0, itemStyle: { color: '#909399' } }
        ],
        emphasis: { scale: true },
        label: { show: true, formatter: '{b}: {d}%' }
      }]
    })
  } catch (error) {
    console.error('预约图表加载失败', error)
  }
}

// 近7天预约趋势折线图
const initTrendChart = async () => {
  try {
    const res = await statisticsApi.getReservationTrend()
    const data = res.data || []
    
    const chart = echarts.init(trendChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: data.map(d => d.date), name: '日期' },
      yAxis: { type: 'value', name: '预约数量' },
      series: [{
        name: '预约数量',
        type: 'line',
        data: data.map(d => d.count),
        smooth: true,
        lineStyle: { color: '#409EFF', width: 3 },
        areaStyle: { opacity: 0.3, color: '#409EFF' },
        itemStyle: { color: '#409EFF' }
      }]
    })
  } catch (error) {
    console.error('趋势图表加载失败', error)
  }
}

// 耗材分类统计柱状图
const initCategoryChart = async () => {
  try {
    const res = await statisticsApi.getUsageByCategory()
    const data = res.data || []
    
    const chart = echarts.init(categoryChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: data.map(d => d.category), axisLabel: { rotate: 30 } },
      yAxis: { type: 'value', name: '领用数量' },
      series: [{
        name: '领用数量',
        type: 'bar',
        data: data.map(d => d.total),
        itemStyle: { borderRadius: [5, 5, 0, 0], color: '#67C23A' }
      }]
    })
  } catch (error) {
    console.error('分类图表加载失败', error)
  }
}

onMounted(() => {
  initDeviceChart()
  initReservationChart()
  initTrendChart()
  initCategoryChart()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
}

.chart-card {
  margin-bottom: 10px;
}

.chart {
  width: 100%;
  height: 300px;
}

.chart-large {
  width: 100%;
  height: 350px;
}
</style>