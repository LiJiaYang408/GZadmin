<template>
  <div class="container">
    <h1>线粒体详细信息</h1>

    <div v-if="loading" class="loading">
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else class="main-content" style="display: flex; gap: 20px;">
      <!-- 左侧列表 -->
      <div class="left-panel" style="flex: 1;width: 500px">
        <div class="search-bar">
          <input
              type="text"
              class="form-control"
              v-model="searchQuery1"
              placeholder="搜索样本名..."
          />
        </div>
        <!-- 设置固定高度并添加滚动条 -->
        <div class="table-container" style="height: 300px; overflow-y: auto;">
          <table class="table">
            <thead>
            <tr>
              <th>目标样本名</th>
              <th>原始数据名</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="detail in paginatedDetails1"
                :key="detail.sample_name"
                @click="handleLeftSelect(detail.sample_name)"
                :class="{'selected-row': selectedSampleLeft === detail.sample_name}"
            >
              <td>{{ detail.sample_name }}</td>
              <td>{{ detail.original_data_name }}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <nav v-if="totalPages1 > 1" class="pagination">
          <button class="btn btn-outline-primary" @click="prevPage1" :disabled="currentPage1 === 1">
            上一页
          </button>
          <span>第 {{ currentPage1 }} 页，共 {{ totalPages1 }} 页</span>
          <button class="btn btn-outline-primary" @click="nextPage1" :disabled="currentPage1 === totalPages1">
            下一页
          </button>
        </nav>
      </div>

      <div class="selected-display-below">
        <h4>目标样本</h4>
        <p>{{ selectedSampleLeft || '未选择' }}</p>

        <h4>对比样本</h4>
        <p>{{ selectedSampleRight || '未选择' }}</p>
        <button class="bot" @click="toCom">对比</button>
      </div>
      <!-- 右侧列表 -->
      <div class="right-panel" style="flex: 1;width: 500px">
        <div class="search-bar">
          <input
              type="text"
              class="form-control"
              v-model="searchQuery2"
              placeholder="搜索样本名..."
          />
        </div>
        <!-- 设置固定高度并添加滚动条 -->
        <div class="table-container" style="height: 300px; overflow-y: auto;">
          <table class="table">
            <thead>
            <tr>
              <th>对比样本名</th>
              <th>原始数据名</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="detail in paginatedDetails2"
                :key="detail.sample_name"
                @click="handleRightSelect(detail.sample_name)"
                :class="{'selected-row': selectedSampleRight === detail.sample_name}"
            >
              <td>{{ detail.sample_name }}</td>
              <td>{{ detail.original_data_name }}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <nav v-if="totalPages2 > 1" class="pagination">
          <button class="btn btn-outline-primary" @click="prevPage2" :disabled="currentPage2 === 1">
            上一页
          </button>
          <span>第 {{ currentPage2 }} 页，共 {{ totalPages2 }} 页</span>
          <button class="btn btn-outline-primary" @click="nextPage2" :disabled="currentPage2 === totalPages2">
            下一页
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

// 全局数据
const details = ref([])
const loading = ref(true)
const error = ref(null)

// 左侧表格相关变量
const searchQuery1 = ref('')
const currentPage1 = ref(1)
const itemsPerPage1 = 5
const selectedSampleLeft = ref(null)

// 右侧表格相关变量
const searchQuery2 = ref('')
const currentPage2 = ref(1)
const itemsPerPage2 = 5
const selectedSampleRight = ref(null)

const router = useRouter()

// 获取数据
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

const toCom = () => {
  if (selectedSampleLeft.value!== null && selectedSampleRight.value!== null) {
    router.push({ path: `/twoComComponent`, query: { sampleName1: selectedSampleLeft.value, sampleName2: selectedSampleRight.value } })
  } else {
    alert("请将数据选择完善！")
  }
}

// 选择处理函数
const handleLeftSelect = (sampleName) => {
  selectedSampleLeft.value = sampleName
}

const handleRightSelect = (sampleName) => {
  selectedSampleRight.value = sampleName
}

// 左侧表格计算属性
const filteredDetails1 = computed(() => {
  return details.value.filter(detail => {
    return detail.sample_name.includes(searchQuery1.value)
  })
})

const paginatedDetails1 = computed(() => {
  const start = (currentPage1.value - 1) * itemsPerPage1
  const end = start + itemsPerPage1
  return filteredDetails1.value.slice(start, end)
})

const totalPages1 = computed(() => {
  return Math.ceil(filteredDetails1.value.length / itemsPerPage1)
})

// 右侧表格计算属性
const filteredDetails2 = computed(() => {
  return details.value.filter(detail => {
    return detail.sample_name.includes(searchQuery2.value)
  })
})

const paginatedDetails2 = computed(() => {
  const start = (currentPage2.value - 1) * itemsPerPage2
  const end = start + itemsPerPage2
  return filteredDetails2.value.slice(start, end)
})

const totalPages2 = computed(() => {
  return Math.ceil(filteredDetails2.value.length / itemsPerPage2)
})

// 分页控制函数
const prevPage1 = () => {
  if (currentPage1.value > 1) currentPage1.value--
}

const nextPage1 = () => {
  if (currentPage1.value < totalPages1.value) currentPage1.value++
}

const prevPage2 = () => {
  if (currentPage2.value > 1) currentPage2.value--
}

const nextPage2 = () => {
  if (currentPage2.value < totalPages2.value) currentPage2.value++
}

// 初始加载
onMounted(fetchData)
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
}

.container {
  padding: 20px;
  border-radius: 8px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.loading,
.error {
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
  width: 95%;
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

.selected-display-below {
  width: 200px;
}

.bot {
  padding: 8px 16px;
  background-color: #182383;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.table-container {
  height: 300px;
  overflow-y: auto;
}
</style>