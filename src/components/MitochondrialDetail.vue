<template>
  <div class="Mit-container">
    <el-card>
      <template #header>
        <div class="card-header"><h1>线粒体详细信息</h1></div>
      </template>
      <div v-if="loading" class="loading">
        <el-skeleton animated />
      </div>
      <div v-else-if="error" class="error">
        <el-alert :title="error" type="error" />
      </div>
      <div v-else class="main-content">
        <div class="left-panel">
          <el-input v-model="searchQuery" placeholder="搜索样本..." clearable @clear="searchQuery = ''">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-table :data="paginatedDetails" stripe @row-click="getData">
            <el-table-column prop="sample_name" label="样本名" />
            <el-table-column prop="analysis_date" label="分析日期" :formatter="formatDate" />
            <el-table-column prop="original_data_name" label="原始数据名" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button @click="goToSiteInfo(scope.row.original_data_name)">查看信息</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
              background
              layout="prev, pager, next"
              :current-page="currentPage"
              :page-sizes="[5]"
              :page-size="itemsPerPage"
              :total="filteredDetails.length"
              @current-change="currentPage = $event"
          />
        </div>
        <!-- 中间环形图区域 -->
        <div class="right-panel">
          <h2>样本位点信息</h2>
          <PieChart :tableData="table" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import PieChart from "@/components/PieChart"
import { Search } from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const details = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 5
const table = ref([])

// 生命周期
onMounted(() => {
  fetchData()
})

// 方法定义
const fetchData = async () => {
  try {
    const response = await axios.get('/table/getMitochondrialDetailAll')
    details.value = response.data.data
    loading.value = false
  } catch (err) {
    loading.value = false
    error.value = '获取数据失败: ' + (err.response?.data?.message || err.message)
  }
}

const getData = async (row) => {
  const sampleName = row.original_data_name
  const response = await axios.get(`/table/getMitochondrialDetailDetails?name=${sampleName}`)
  table.value = response.data.data
}

const formatDate = (row, column, cellValue) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(cellValue).toLocaleDateString('zh-CN', options)
}

const goToSiteInfo = (sampleName) => {
  router.push({ path: '/siteInfo', query: { sampleName } })
}

// 计算属性
const filteredDetails = computed(() => {
  return details.value.filter(detail => {
    return detail.sample_name.includes(searchQuery.value);
  })
})

const paginatedDetails = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredDetails.value.slice(start, end)
})
</script>

<style scoped>
.Mit-container {
  margin: 0 auto;
  padding: 20px;
  width: 80%;
}

.left-panel {
  margin-bottom: 20px;
  width: 80%;
}

.right-panel {
  margin-top: 20px;
}

.left-panel{
  margin-right: 20px;
}
</style>