<template>
  <div class="record-list-container">
    <div class="search-bar">
      <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="搜索目标样本..."
      />
    </div>

    <table class="table"  v-if="filteredDetails.length > 0">
      <thead>
      <tr>
        <th>分析日期</th>
        <th>目标样本名</th>
        <th>比对样本名</th>
        <th>容差</th>
        <th v-if="type">操作</th>
      </tr>
      </thead>
      <tbody>

      <tr v-for="detail in paginatedDetails" :key="detail.sample_name">
        <td>{{ formatDate(detail.time) }}</td>
        <td>{{ detail.goal_name }}</td>
        <td>{{ detail.compare_name }}</td>
        <td>{{ detail.allowance }}</td>
        <td v-if="type">
          <button class="btn btn-primary-Mit" @click="toCom(detail.original_goal,detail.original_compare,detail.goal_name,detail.compare_name)">
            查看信息
          </button>
        </td>
      </tr>
      </tbody>
    </table>
    <p v-else>没有找到匹配的数据。</p>
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
</template>

<script setup>
import {ref, computed, defineProps} from 'vue'
import { useRouter } from 'vue-router'

// 接收父组件传递的数据
const props = defineProps({
  details: {
    type: Array,
    default: () => []
  },
  type:{
    type:Boolean,
    default: true
  }
})

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 5
const router = useRouter()

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('zh-CN', options)
}

const toCom = (sampleName1,sampleName2,selectedLeft,selectedRight) => {
  router.push({ path: `/twoComComponent`, query: { sampleName1: sampleName1, sampleName2: sampleName2,selectedRight:selectedRight,selectedLeft:selectedLeft } })
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// 计算属性
const filteredDetails = computed(() => {
  const filtered = props.details.filter(detail => {
    return detail.goal_name.includes(searchQuery.value)
  })
  // 按照 allowance 从小到大排序
  return filtered.sort((a, b) => a.allowance - b.allowance)
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

<style scoped>
.record-list-container {
  width: 100%;
  max-width: 100%;
  margin: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.form-control {
  width: 97%;
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
  min-width: 150px;
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

.loading,
.error {
  padding: 20px;
  text-align: center;
}

.error {
  color: #dc3545;
}
</style>