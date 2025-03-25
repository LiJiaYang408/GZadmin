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
        <th>步长</th>
        <th>单倍群</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in filterData" :key="item.compareSample">
        <td>{{ item.targetSample }}</td>
        <td>
            <span
                class="clickable-sample"
                @click="handleViewDetail(item.compareSample)"
            >
              {{ item.compareSample }}
            </span>
        </td>
        <td>{{ item.step }}</td>
        <td>{{ item.group }}</td>
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
import { ref, computed } from 'vue';

const sampleData = ref([
  { targetSample: 'MT-Target001', compareSample: 'MT-Target001', step: 0, group: 'MT-D8001' },
  { targetSample: 'MT-Target001', compareSample: 'MT-Target002', step: 2, group: 'MT-DB001' },
  { targetSample: 'MT-Target001', compareSample: 'MT-Target003', step: 4, group: 'MT-DB003' },
  { targetSample: 'MT-Target001', compareSample: 'MT-Target004', step: 1, group: 'MT-DB003' },
  { targetSample: 'MT-Target001', compareSample: 'MT-Target005', step: 8, group: 'MT-DB005' },
  { targetSample: 'MT-Target001', compareSample: 'MT-Target005', step: 8, group: 'MT-DB005' },
]);

const searchValue = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(5);

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

const handleViewDetail = (sampleId) => {
  console.log('查看详情', sampleId);
};
</script>

<style scoped>
/* 原有样式 */
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