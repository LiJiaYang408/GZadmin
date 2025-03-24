<template>
  <!-- 模板部分保持不变 -->
  <div class="container">
    <!-- 左边选择样本区域 -->
    <div class="left-panel">
      <h2>样本选择</h2>
      <div class="sample-selector">
        <select v-model="selectedSample" @change="updateChartData">
          <option v-for="sample in samples" :key="sample" :value="sample">
            {{ sample }}
          </option>
        </select>
      </div>
    </div>

    <!-- 中间环形图区域 -->
    <div class="middle-panel">
      <h2>样本位点信息</h2>
      <PieChart :tableData="tableData" />
    </div>

    <!-- 右边表格区域 -->
    <div class="right-panel">
      <h2>位点详情</h2>
      <div class="table-container">
        <table>
          <thead>
          <tr>
            <th>位点</th>
            <th>突变碱基</th>
            <th>参考碱基</th>
            <th>类型</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in tableData" :key="item.position">
            <td>{{ item.base_position }}</td>
            <td>{{ item.mutant_base }}</td>
            <td>{{ item.reference_base }}</td>
            <td>{{item.type}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import PieChart from './PieChart.vue';

// 响应式数据
const selectedSample = ref('');
const samples = ref([]);
const chartDataMap = ref({});

// 计算属性
const tableData = computed(() => {
  return chartDataMap.value[selectedSample.value] || [];
});

// 生命周期
onMounted(() => {
  fetchData();
  // useMockData()
});

const fetchData = async () => {
  try {
    const response = await axios.get('/table/getMitochondrialAndSiteInfo');
    const data = response.data.data;
    samples.value = data.samples;
    chartDataMap.value = data.chartDataMap;

    if (samples.value.length > 0) {
      selectedSample.value = samples.value[0];
    }
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};

const updateChartData = (event) => {
  selectedSample.value = event.target.value;
};
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 600px;
  padding: 20px;
  box-sizing: border-box;
}

.left-panel {
  width: 20%;
  padding: 20px;
  margin-right: 20px;
}

.middle-panel {
  width: 50%;
  padding: 20px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.right-panel {
  width: 30%;
  padding: 20px;
}

.sample-selector {
  margin-top: 20px;
}

select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.table-container {
  width: 100%;
  max-height: 400px;
  overflow-y: overlay; /* 使用overlay确保滚动条不占用额外空间 */
}

/* 美化滚动条 */
.table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: transparent; /* 使轨道透明，减少视觉干扰 */
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: rgba(136, 136, 136, 0.5); /* 半透明的滑块 */
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: rgba(85, 85, 85, 0.8); /* 鼠标悬停时滑块变暗 */
}

.table-container:hover {
  /*overflow-y: overlay; !* 鼠标悬停时显示滚动条 *!*/
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f9f9f9;
  font-weight: normal;
}

tr:hover {
  background-color: #f5f5f5;
}

h2 {
  margin-top: 0;
  text-align: center;
}
</style>