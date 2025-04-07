<template>
  <div class="container">
    <div class="back-btn-container">
      <button @click="goBack">← 返回</button>
    </div>
    <div class="chart-container">
      <h2>目标样本名：<el-tag>{{ route.query.selectedLeft }}</el-tag></h2>
      <PieChart :tableData="tableData1" />
    </div>

    <div class="allowance">
      <h2>容差： {{ compareResult.length }}</h2>
      <div class="list-container">
      <div class="result-count">
        <span v-if="compareResult.length === 0" class="empty-tip">（无匹配结果）</span>
      </div>

      <el-table :data="compareResult" stripe>
        <el-table-column prop="position" label="碱基位置"></el-table-column>
        <el-table-column prop="standard" label="参考碱基"></el-table-column>
        <el-table-column prop="target" label="目标样本"></el-table-column>
        <el-table-column prop="db" label="对比样本"></el-table-column>
      </el-table>
      </div>
    </div>

    <div class="chart-container">
      <h2>比对样本名：<el-tag>{{ route.query.selectedRight }}</el-tag></h2>
      <PieChart :tableData="tableData2" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import PieChart from '@/components/PieChart';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
// 引入 ElementPlus 的 el-table 和 el-table-column
import { ElTable, ElTableColumn } from 'element-plus';

const route = useRoute();
const router = useRouter();

const tableData1 = ref([]);
const tableData2 = ref([]);
const compareResult = ref([]);

const fetchData = async () => {
  try {
    const response1 = await axios.get('/table/getMitochondrialDetailDetails?name=' + route.query.sampleName1);
    tableData1.value = response1.data.data;
    const response2 = await axios.get('/table/getMitochondrialDetailDetails?name=' + route.query.sampleName2);
    tableData2.value = response2.data.data;

    // 从后端获取对比结果
    const compareResponse = await axios.get(
        `/comparison/compare?sampleName1=${route.query.sampleName1}&sampleName2=${route.query.sampleName2}`
    );
    compareResult.value = compareResponse.data;
  } catch (error) {
    if (error.response) {
      // 服务器返回错误状态码
      alert(`请求失败，请检查网络连接或 Redis 是否开启，状态码：${error.response.status}，错误信息：${error.response.data.message}`);
    } else if (error.request) {
      // 请求已发送，但没有收到响应
      alert('没有收到服务器响应，请检查网络连接或 Redis 是否开启。');
    } else {
      // 其他错误
      alert(`发生未知错误：${error.message}`);
    }
  }
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
  height: 500px;
}

/* 移除原有的表格样式 */
table {
  display: none;
}

.allowance{
  width: 600px;
}
</style>