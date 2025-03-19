<template>
  <div class="sample-info-container">
    <!-- 左侧选择框区域 -->
    <div class="select-region">
      <h3>样本位点具体情况</h3>
      <select v-model="selectedSample" class="sample-select">
        <option v-for="sample in samples" :key="sample.value" :value="sample.value">
          {{ sample.label }}
        </option>
      </select>
    </div>

    <!-- 中间环形图区域 -->
    <div class="chart-region">
      <h3>样本位点信息</h3>
      <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
        <div class="chart-center" @mouseover="resetCenterText">
          <span ref="centerText">{{ centerText }}</span>
        </div>
      </div>
    </div>

    <!-- 右侧表格区域 -->
    <div class="table-region">
      <h3>样本位点序列情况</h3>
      <table class="data-table">
        <thead>
        <tr>
          <th>位点</th>
          <th>样本序列</th>
          <th>标准序列</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in tableData" :key="item.site">
          <td>{{ item.site }}</td>
          <td>{{ item.sampleSeq }}</td>
          <td>{{ item.standardSeq }}</td>
        </tr>
        </tbody>
      </table>
      <div class="total-items">共 {{ tableData.length }} 项</div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'SampleInfo',
  data() {
    return {
      selectedSample: 'sample1',
      samples: [
        { value: 'sample1', label: '样本1' },
        { value: 'sample2', label: '样本2' },
        { value: 'sample3', label: '样本3' }
      ],
      chart: null,
      centerText: 'REF',
      tableData: [
        { site: 73, sampleSeq: 'A', standardSeq: 'G' },
        { site: 194, sampleSeq: 'C', standardSeq: 'A' },
        { site: 248, sampleSeq: 'A', standardSeq: 'G' },
        { site: 436, sampleSeq: 'C', standardSeq: 'T' },
        { site: 437, sampleSeq: 'C', standardSeq: 'T' },
        { site: 489, sampleSeq: 'T', standardSeq: 'C' },
        { site: 511, sampleSeq: 'C', standardSeq: 'T' },
        { site: 8020, sampleSeq: 'G', standardSeq: 'A' },
        { site: 16129, sampleSeq: 'G', standardSeq: 'A' },
        { site: 16223, sampleSeq: 'C', standardSeq: 'T' },
        { site: 16257, sampleSeq: 'C', standardSeq: 'T' }
      ]
    };
  },
  watch: {
    selectedSample() {
      this.updateChart();
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const ctx = this.$refs.chartCanvas.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['匹配', '不匹配', '未检测'],
          datasets: [{
            data: [7, 3, 1],
            backgroundColor: [
              '#4CAF50',
              '#F44336',
              '#EEEEEE'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'right',
            },
            tooltip: {
              enabled: false
            }
          },
          onHover: (event, chartElements) => {
            if (chartElements && chartElements.length > 0) {
              const element = chartElements[0];
              this.centerText = this.chart.data.labels[element.index];
            } else {
              this.centerText = 'REF';
            }
          }
        }
      });
    },
    updateChart() {
      // 这里可以根据选中的样本更新图表数据
      // 示例中我们只是重新渲染现有数据
      this.chart.data.datasets[0].data = [7, 3, 1];
      this.chart.update();
    },
    resetCenterText() {
      this.centerText = 'REF';
    }
  }
};
</script>

<style scoped>
.sample-info-container {
  display: flex;
  padding: 20px;
  width: 1500px;
}

.select-region {
  width: 25%;
  padding-right: 20px;
}

.chart-region {
  width: 50%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.table-region {
  width: 25%;
  padding-left: 20px;
}

h3 {
  margin-bottom: 15px;
  color: #333;
}

.sample-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.chart-container {
  width: 100%;
  max-width: 400px;
  height: 300px;
  margin-top: 20px;
  position: relative;
}

.chart-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.data-table th, .data-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.data-table th {
  background-color: #f2f2f2;
}

.total-items {
  margin-top: 15px;
  text-align: right;
  color: #666;
}
</style>