<template>
  <div class="container">
    <div class="back-btn-container">
      <button @click="goBack">← 返回</button>
    </div>
    <div class="chart-container">
      <h2>目标样本名：{{route.query.sampleName1}}</h2>
      <PieChart :tableData="tableData1"/>
    </div>

    <div class="list-container">
      <div class="result-count">
        容差： {{ compareResult.length }}
        <span v-if="compareResult.length === 0" class="empty-tip">（无匹配结果）</span>
      </div>
      <table>
        <thead>
        <tr>
          <th>目标样本</th>
          <th>对比样本</th>
          <th>参考碱基</th>
          <th>位点</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in compareResult" :key="index">
          <td>{{ item.target }}</td>
          <td>{{ item.db }}</td>
          <td>{{ item.standard }}</td>
          <td>{{ item.position }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="chart-container">
      <h2>对比样本名：{{route.query.sampleName2}}</h2>
      <PieChart :tableData="tableData2"/>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import PieChart from "@/components/PieChart";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const tableData1 = ref([]);
const tableData2 = ref([]);
const compareResult = ref([]);

const fetchData = async () => {
  const response1 = await axios.get('/table/getMitochondrialDetailDetails?name=' + route.query.sampleName1);
  tableData1.value = response1.data.data;
  const response2 = await axios.get('/table/getMitochondrialDetailDetails?name=' + route.query.sampleName2);
  tableData2.value = response2.data.data;
  // 从后端获取对比结果
  const compareResponse = await axios.get(`/comparison/compare?sampleName1=${route.query.sampleName1}&sampleName2=${route.query.sampleName2}`);
  compareResult.value = compareResponse.data;
};

onMounted(() => {
  fetchData();
});

// 添加返回方法
const goBack = () => {
  router.back();
};
</script>

<style scoped>
.container {
  width: 100%;
  display: flex;
  gap: 20px;
  padding: 20px;
  position: relative;
}

.back-btn-container {
  position: absolute;
  top: 20px;
  left: 20px;
}

button {
  padding: 8px 16px;
  background-color: #182383;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.chart-container {
  flex: 1;
}

.list-container {
  flex: 1;
  overflow-y: auto;
  height: 400px;
}

table {
  width: 100%; /* 表格占满容器宽度 */
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
  min-width: 70px;
}
</style>