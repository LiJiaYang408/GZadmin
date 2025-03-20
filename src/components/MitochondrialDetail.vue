<template>
  <div class="container">
    <h1>线粒体详细信息</h1>

    <div v-if="loading" class="loading">
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else>
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
        <tr v-for="detail in paginatedDetails" :key="detail.sample_name">
          <td>{{ detail.sample_name }}</td>
          <td>{{ formatDate(detail.analysis_date) }}</td>
          <td>{{ detail.original_data_name }}</td>
          <td>
            <button class="btn btn-primary" @click="goToSiteInfo(detail.sample_name)">
              查看位点信息
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
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  setup() {
    const router = useRouter()
    const details = ref([])
    const loading = ref(true)
    const error = ref(null)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const itemsPerPage = 5

    // 从后端获取数据
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

    // 格式化日期
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      return new Date(dateString).toLocaleDateString('zh-CN', options)
    }

    // 计算属性：过滤后的详细信息列表
    const filteredDetails = computed(() => {
      return details.value.filter(detail => {
        return (
            detail.sample_name.includes(searchQuery.value) ||
            formatDate(detail.analysis_date).includes(searchQuery.value) ||
            detail.original_data_name.includes(searchQuery.value)
        )
      })
    })

    // 计算属性：分页后的详细信息列表
    const paginatedDetails = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredDetails.value.slice(start, end)
    })

    // 计算属性：总页数
    const totalPages = computed(() => {
      return Math.ceil(filteredDetails.value.length / itemsPerPage)
    })

    // 跳转到位点信息页面
    const goToSiteInfo = (sampleName) => {
      router.push({ path: `/siteInfo`, query: { sampleName: sampleName } })
    }

    // 上一页
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    // 下一页
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    // 在组件挂载时获取数据
    onMounted(() => {
      fetchData()
    })

    return {
      details,
      loading,
      error,
      searchQuery,
      currentPage,
      itemsPerPage,
      formatDate,
      goToSiteInfo,
      filteredDetails,
      paginatedDetails,
      totalPages,
      prevPage,
      nextPage
    }
  }
}
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
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

.btn-primary {
  background-color: #007bff;
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