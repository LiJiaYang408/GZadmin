<template>
  <div class="chart-container">
    <div class="legend-container">
      <div class="legend-item">
        <span class="legend-color" style="background-color: #fd6f6f;"></span>
        <span class="legend-text">T</span>
      </div>
      <div class="legend-item">
        <span class="legend-color" style="background-color: #9fe080;"></span>
        <span class="legend-text">G</span>
      </div>
      <div class="legend-item">
        <span class="legend-color" style="background-color: #7ed3f4;"></span>
        <span class="legend-text">C</span>
      </div>
      <div class="legend-item">
        <span class="legend-color" style="background-color: #ffdc60;"></span>
        <span class="legend-text">A</span>
      </div>
    </div>
    <div ref="chartDom" class="chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, defineProps, toRef } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  tableData: {
    type: Array,
    default: () => []
  }
});

const tableDataRef = toRef(props, 'tableData');

// 响应式数据
const chartInstance = ref(null);
const chartDom = ref(null);

// 生命周期
onMounted(() => {
  initChart();
  updateChart();
});

onBeforeUnmount(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }
});

watch(tableDataRef, () => {
  updateChart();
});

// 方法
const initChart = () => {
  chartInstance.value = echarts.init(chartDom.value);
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        if (params.name === '无数据') {
          return '';
        }
        return `${params.name}`;
      }
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
            show: (params) => params.data.name !== '无数据',
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
  };
  chartInstance.value.setOption(option);
};

const updateChart = () => {
  const colorMap = {
    'C': '#7ed3f4',
    'A': '#ffdc60',
    'T': '#fd6f6f',
    'G': '#9fe080'
  };

  const data = tableDataRef.value.map((item) => {
    const color = item.type !== 'SNP' ? 'yellow' : colorMap[item.reference_base];
    return {
      name: `${item.base_position}${item.reference_base}`,
      value: 1,
      base_position: parseInt(item.base_position),
      itemStyle: {
        color: color
      }
    };
  }).sort((a, b) => a.base_position - b.base_position);

  const totalPositions = 16569;
  const dataCount = data.length;
  const emptyValue = (totalPositions * 0.75) / (0.25) * dataCount / totalPositions;

  const emptyData = {
    name: '无数据',
    itemStyle: {
      color: 'rgba(0, 0, 0, 0.1)'
    }
  };

  const finalData = [];

  if (dataCount === 0) {
    finalData.push({ ...emptyData, value: emptyValue });
  } else {
    const firstEmptyValue = data[0].base_position > 1 ? (data[0].base_position - 1) / totalPositions * emptyValue : 0;
    if (firstEmptyValue > 0) {
      finalData.push({ ...emptyData, value: firstEmptyValue });
    }

    for (let i = 0; i < dataCount; i++) {
      finalData.push(data[i]);
      if (i < dataCount - 1) {
        const gap = data[i + 1].base_position - data[i].base_position - 1;
        const gapEmptyValue = gap / totalPositions * emptyValue;
        if (gapEmptyValue > 0) {
          finalData.push({ ...emptyData, value: gapEmptyValue });
        }
      }
    }

    const lastEmptyValue = totalPositions - data[dataCount - 1].base_position > 0 ? (totalPositions - data[dataCount - 1].base_position) / totalPositions * emptyValue : 0;
    if (lastEmptyValue > 0) {
      finalData.push({ ...emptyData, value: lastEmptyValue });
    }
  }

  const option = {
    series: [
      {
        data: finalData
      }
    ]
  };
  chartInstance.value.setOption(option);
};
</script>

<style scoped>
.chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 350px;
  margin-top: 20px;
}

.legend-container {
  display: flex;
  flex-direction: column;
  margin-right: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.legend-color {
  width: 15px;
  height: 10px;
  margin-right: 8px;
  border-radius: 2px;
}

.legend-text {
  font-size: 14px;
}

.chart {
  width: 400px;
  height: 400px;
}
</style>