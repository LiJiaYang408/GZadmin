<template>
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

<script>
import * as echarts from 'echarts';
import axios from "axios";

export default {
  name: 'SampleSiteInfo',
  data() {
    return {
      chartInstance: null,
      selectedSample: '',
      samples: [],
      chartDataMap: {}, // 用于存储每个样本对应的数据
    };
  },
  computed: {
    tableData() {
      // 根据选中的样本返回对应的数据
      return this.chartDataMap[this.selectedSample] || [];
    },
  },
  mounted() {
    this.fetchData();
  },
  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
  methods: {
    async fetchData() {
      // 模拟从后台获取数据
      try {
        // 这里应该是一个真实的API调用，例如：
        const response = await axios.get('/table/getMitochondrialDetailAndSiteInfo');
        const data = await response.data.data;
        console.log(data)
        this.samples = data.samples;
        this.chartDataMap = data.chartDataMap;

        // 默认选择第一个样本
        if (this.samples.length > 0) {
          this.selectedSample = this.samples[0];
          this.initChart();
          this.updateChart();
        }
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    },
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chartDom);
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
        },
        legend: {
          show: false,
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '65%'], // 调整环形图的内外半径，使环更圆滑
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: [],
          },
        ],
      };
      this.chartInstance.setOption(option);
    },
    updateChart() {
      // 根据当前选中的样本数据更新图表
      const data = this.tableData.map((item) => ({
        name: `${item.base_position}${item.reference_base}`,
        value: 1,
      }));

      // 更新图表数据
      const option = {
        series: [
          {
            data,
          },
        ],
      };
      this.chartInstance.setOption(option);
    },
    updateChartData(event) {
      // 当选择不同的样本时，更新图表数据
      this.selectedSample = event.target.value;
      this.updateChart();
    },
    resizeChart() {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    },
  },
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