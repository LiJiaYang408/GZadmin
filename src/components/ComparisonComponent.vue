<template>
  <div class="database-compare-container">
    <h1>数据对比</h1>
    <div class="search-container">
      <input
          type="text"
          class="form-control"
          v-model="searchValue"
          placeholder="请输入......"
      />
    </div>

    <table class="compare-table">
      <thead>
      <tr>
        <th>目标样本名</th>
        <th>比对样本名</th>
        <th>容差</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in filterData" :key="item.target_sample_name">
        <td>{{ item.target_sample_name }}</td>
        <td>
            <span
                class="clickable-sample"
                @click="handleViewDetail(item.target_sample_name,item.compare_sample_name)"
            >
              {{ item.compare_sample_name }}
            </span>
        </td>
        <td>{{ item.step }}</td>
      </tr>
      </tbody>
    </table>

    <nav v-if="totalPages > 1" class="pagination justify-content-center mt-4">
      <button
          class="btn btn-outline-primary me-2"
          @click="prevPage"
          :disabled="currentPage === 1"
      >
        上一页
      </button>

      <span class="mx-2">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>

      <button
          class="btn btn-outline-primary ms-2"
          @click="nextPage"
          :disabled="currentPage === totalPages"
      >
        下一页
      </button>
    </nav>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import router from "@/router";
import axios from "axios";

// const sampleData = ref([
//   { targetSample: 'MT-Target001', compareSample: 'MT-Target001', step: 0 },
//   { targetSample: 'MT-Target001', compareSample: 'MT-Target002', step: 2 },
//   { targetSample: 'MT-Target001', compareSample: 'MT-Target003', step: 4 },
//   { targetSample: 'MT-Target001', compareSample: 'MT-Target004', step: 1 },
//   { targetSample: 'MT-Target001', compareSample: 'MT-Target005', step: 8 },
//   { targetSample: 'MT-Target001', compareSample: 'MT-Target005', step: 8 },
// ]);

const sampleData = ref([])
const searchValue = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(5);

const getAllCom = async () => {
  const response = await axios.get('/comparison/getAllCom')
  sampleData.value = response.data.data
}

// 计算总页数
const totalPages = computed(() => {
  const filteredCount = sampleData.value.filter(item =>
      Object.values(item).some(val => String(val).includes(searchValue.value))
  ).length;
  return Math.ceil(filteredCount / itemsPerPage.value);
});

// 过滤后的数据（带分页）
const filterData = computed(() => {
  const filtered = sampleData.value.filter(item =>
      Object.values(item).some(val => String(val).includes(searchValue.value))
  );
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return filtered.slice(startIndex, startIndex + itemsPerPage.value);
});

// 分页操作
const prevPage = () => currentPage.value--;
const nextPage = () => currentPage.value++;

const handleViewDetail = (sample1,sample2) => {
  console.log(sample1,sample2)
  router.push({ path: `/twoComComponent`, query: { sampleName1: sample1,sampleName2:sample2 } })
};
onMounted(()=>{
  getAllCom()
})
</script>

<style scoped>
.database-compare-container {
  padding: 20px;
  width: 100%;
}

.search-container {
  margin-bottom: 20px;
}

.form-control {
  width: 98%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.compare-table th,
.compare-table td {
  border: 1px solid #e9e9e9;
  padding: 12px;
  text-align: left;
}

.compare-table th {
  background-color: #f5f7fa;
}

.clickable-sample {
  color: #409eff;
  cursor: pointer;
}

/* 新增分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  transition: all 0.3s ease;
}

.pagination button:hover {
  background-color: #f8f9fa;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-outline-primary {
  color: #007bff;
  border-color: #007bff;
}

.btn-outline-primary:hover {
  color: white;
  background-color: #007bff;
}
</style>