<template>
  <div>
    <div class="search-bar">
      <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="搜索样本名..."
      />
    </div>
    <!-- 设置固定高度并添加滚动条 -->
    <div class="table-container">
      <table class="table">
        <thead>
        <tr>
          <th>{{ header1 }}</th>
          <th>{{ header2 }}</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="detail in paginatedDetails"
            :key="detail.original_data_name"
            @click="handleSelect(detail.original_data_name, detail.sample_name)"
            :class="{'selected-row': selectedSample === detail.original_data_name}"
        >
          <td>{{ detail.sample_name }}</td>
          <td>{{ detail.original_data_name }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <nav class="page">
      <el-button @click="prevPage" :disabled="currentPage === 1">
        上一页
      </el-button>
      <span>第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
      <el-button @click="nextPage" :disabled="currentPage === totalPages">
        下一页
      </el-button>
    </nav>
  </div>
</template>

<script setup>
import {ref, computed, defineProps,defineEmits} from 'vue'

// 接收父组件传递的 props
const props = defineProps({
  details: {
    type: Array,
    default: () => []
  },
  header1: {
    type: String,
    default: ''
  },
  header2: {
    type: String,
    default: ''
  },
  selectedSampleOther: {
    type: String,
    default: null
  }
})

// 定义事件
const emits = defineEmits(['select'])

// 搜索和分页相关变量
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 5
const selectedSample = ref(null)

// 过滤数据
const filteredDetails = computed(() => {
  return props.details.filter(detail => {
    return detail.sample_name.includes(searchQuery.value) && detail.original_data_name!== props.selectedSampleOther
  })
})

// 分页数据
const paginatedDetails = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredDetails.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredDetails.value.length / itemsPerPage)
})

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// 选择处理函数
const handleSelect = (sampleName, sampleName1) => {
  // 如果当前点击的样本名已经被选中，则取消选择
  if (selectedSample.value === sampleName) {
    selectedSample.value = null
    emits('select', null, null)
  } else {
    selectedSample.value = sampleName
    emits('select', sampleName, sampleName1)
  }
}
</script>

<style scoped>
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
}

.table th {
  border-bottom: 1px solid #ddd;
}

.table tr:hover {
  background-color: #fcfafa;
}

.page {
  margin-top: 10px;
}

.el-button {
  margin: 10px;
}
</style>