<template>
  <div class="container">
    <div class="chart-container">
      <h2>样本名：{{}}</h2>
      <PieChart :tableData="tableData1"/>
    </div>
    <div class="list-container">
      <table>
        <thead>
        <tr>
          <th>目标样本</th>
          <th>数据库样本</th>
          <th>参考碱基</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in compareResult" :key="index">
          <td>{{ item.target }}</td>
          <td>{{ item.db }}</td>
          <td>{{ item.standard }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="chart-container">
      <PieChart :tableData="tableData2"/>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import PieChart from "@/components/PieChart";
import axios from "axios";
import {useRoute} from "vue-router";

const  tableData1=ref([])
const  tableData2=ref([])
const route = useRoute()

const fetchData = async () => {
  const response1 = await axios.get('/table/getMitochondrialDetailDetails?name='+route.query.sampleName1)
  tableData1.value = response1.data.data
  const response2 = await axios.get('/table/getMitochondrialDetailDetails?name='+route.query.sampleName2)
  tableData2.value = response2.data.data
}

onMounted(()=>{
  fetchData()
})

// 模拟目标样本和数据库样本数据
const targetData = [
  { key: '73G', value: 1 },
  { key: '263G', value: 1 },
  // 其他数据...
];

const dbData = [
  { key: '73G', value: 1 },
  { key: '263G', value: 1 },
  // 其他数据...
];

// 对比数据
const compareResult = ref([]);
targetData.forEach((targetItem, index) => {
  const dbItem = dbData[index];
  compareResult.value.push({
    target: targetItem.key,
    db: dbItem ? dbItem.key : '',
    standard: 'A' // 假设标准序列
  });
});

</script>

<style scoped>
.container {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.chart-container {
  flex: 1;
}

.list-container {
  flex: 1;
  overflow-y: auto;
  width: 1800px;
  height: 400px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
</style>