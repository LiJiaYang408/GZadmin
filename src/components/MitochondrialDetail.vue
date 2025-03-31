<template>
  <div class="container">
    <h1>线粒体详细信息</h1>

    <div v-if="loading" class="loading">
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else class="main-content">
      <div class="left-panel">
        <div class="search-bar">
          <input
              type="text"
              class="form-control"
              v-model="searchQuery"
              placeholder="搜索样本..."
          />
        </div>

        <table class="table">
          <thead>
          <tr>
            <th>样本名</th>
            <th>分析日期</th>
            <th>原始数据名</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="detail in paginatedDetails" :key="detail.sample_name" @click="getData(detail.original_data_name)">
            <td>{{ detail.sample_name }}</td>
            <td>{{ formatDate(detail.analysis_date) }}</td>
            <td>{{ detail.original_data_name }}</td>
            <td>
              <button class="btn btn-primary-Mit" @click="goToSiteInfo(detail.original_data_name)">
                查看信息
              </button>
            </td>
          </tr>
          </tbody>
        </table>

        <nav v-if="totalPages > 1" class="pagination">
          <button class="btn btn-outline-primary" @click="prevPage" :disabled="currentPage === 1">
            上一页
          </button>
          <span>第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
          <button class="btn btn-outline-primary" @click="nextPage" :disabled="currentPage === totalPages">
            下一页
          </button>
        </nav>
      </div>

      <!-- 中间环形图区域 -->
      <div class="right-panel">
        <h2>样本位点信息</h2>
        <PieChart :tableData="table" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import PieChart from "@/components/PieChart"

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

const getData = async (sampleName) => {
  const response = await axios.get(`/table/getMitochondrialDetailDetails?name=${sampleName}`)
  table.value = response.data.data
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('zh-CN', options)
}

const goToSiteInfo = (sampleName) => {
  router.push({ path: '/siteInfo', query: { sampleName } })
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// 计算属性
const filteredDetails = computed(() => {
  return details.value.filter(detail => {
    return (
        detail.sample_name.includes(searchQuery.value) ||
        formatDate(detail.analysis_date).includes(searchQuery.value) ||
        detail.original_data_name.includes(searchQuery.value)
    )
  })
})

const paginatedDetails = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredDetails.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredDetails.value.length / itemsPerPage)
})
</script>

<style>
.container {
  padding: 20px;
  border-radius: 8px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.loading, .error {
  padding: 20px;
  text-align: center;
}

.error {
  color: #dc3545;
}

.main-content {
  display: flex;
  gap: 20px;
}


.search-bar {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th,
.table td {
  min-width: 150px; /* 关键列设置最小宽度 */
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.table tr:hover {
  background-color: #f1f1f1;
}

.btn {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
  text-decoration: none;
}

.btn-primary-Mit {
  background-color: #303da1;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  align-items: center;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
}
</style>
