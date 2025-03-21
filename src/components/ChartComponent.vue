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
      <div class="chart-container">
        <div ref="chartDom" class="chart"></div>
      </div>
    </div>

    <!-- 右边表格区域 -->
    <div class="right-panel">
      <h2>位点详情</h2>
      <div class="table-container">
        <table>
          <thead>
          <tr>
            <th>位点</th>
            <th>样本序列</th>
            <th>标准序列</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in tableData" :key="item.position">
            <td>{{ item.base_position }}</td>
            <td>{{ item.mutant_base }}</td>
            <td>{{ item.reference_base }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
// import axios from 'axios'

// 响应式数据
const chartInstance = ref(null)
const selectedSample = ref('')
const samples = ref([])
const chartDataMap = ref({})
const chartDom = ref(null)

// 计算属性
const tableData = computed(() => {
  return chartDataMap.value[selectedSample.value] || []
})

// 生命周期
onMounted(() => {
  // fetchData()
  useMockData()
})

onBeforeUnmount(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }
})

// 方法
const initChart = () => {
  chartInstance.value = echarts.init(chartDom.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      show: false
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: []
      }
    ]
  }
  chartInstance.value.setOption(option)
}

const updateChart = () => {
  const data = tableData.value.map((item) => ({
    name: `${item.base_position}${item.reference_base}`,
    value: 1
  }))

  const option = {
    series: [
      {
        data
      }
    ]
  }
  chartInstance.value.setOption(option)
}

const updateChartData = (event) => {
  selectedSample.value = event.target.value
  updateChart()
}

// const resizeChart = () => {
//   if (chartInstance.value) {
//     chartInstance.value.resize()
//   }
// }

// 模拟数据方法
const useMockData = () => {
  samples.value = ['样本1', '样本2', '样本3', '样本4']
  chartDataMap.value = {
    样本1: [
      { base_position: '73', mutant_base: 'A', reference_base: 'G' },
      { base_position: '194', mutant_base: 'C', reference_base: 'A' },
      { base_position: '248', mutant_base: 'A', reference_base: 'G' }
    ],
    样本2: [
      { base_position: '436', mutant_base: 'C', reference_base: 'T' },
      { base_position: '437', mutant_base: 'C', reference_base: 'T' },
      { base_position: '489', mutant_base: 'T', reference_base: 'C' }
    ],
    样本3: [
      { base_position: '511', mutant_base: 'C', reference_base: 'T' },
      { base_position: '8020', mutant_base: 'G', reference_base: 'A' },
      { base_position: '16129', mutant_base: 'G', reference_base: 'A' }
    ],
    样本4: [
      { base_position: '16223', mutant_base: 'C', reference_base: 'T' },
      { base_position: '16257', mutant_base: 'C', reference_base: 'T' },
      { base_position: '16311', mutant_base: 'T', reference_base: 'C' },
      { base_position: '16362', mutant_base: 'T', reference_base: 'C' },
      { base_position: '16519', mutant_base: 'T', reference_base: 'C' }
    ]
  }

  if (samples.value.length > 0) {
    selectedSample.value = samples.value[0]
    initChart()
    updateChart()
  }
}

// 如果需要真实数据，可以恢复这个方法
/* const fetchData = async () => {
  try {
    const response = await axios.get('/table/getMitochondrialAndSiteInfo')
    const data = response.data.data
    samples.value = data.samples
    chartDataMap.value = data.chartDataMap

    if (samples.value.length > 0) {
      selectedSample.value = samples.value[0]
      initChart()
      updateChart()
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  }
} */
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

.chart-container {
  width: 100%;
  height: 350px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart {
  width: 400px;
  height: 400px;
}

.table-container {
  width: 100%;
  max-height: 400px;
  /*overflow-y: overlay; !* 使用overlay确保滚动条不占用额外空间 *!*/
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