<template>
  <div class="chart-container">
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
      // 自定义 tooltip 内容，不显示百分比
      formatter: function (params) {
        if (params.name === '无数据') {
          return ''; // 触碰无数据区域时不显示提示
        }
        return `${params.name}: ${params.value}`;
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
            show: (params) => params.data.name!== '无数据',
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
    'T': '#d0134a',
    'G': '#ffa500',
    'C': '#0000ff',
    'A': '#00ff00'
  };

  const data = tableDataRef.value.map((item) => {
    const color = item.type!== 'SNP'? 'yellow' : colorMap[item.reference_base];
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
  const emptyValue = (totalPositions * 0.7) / (0.3) * dataCount / totalPositions;

  const emptyData = {
    name: '无数据',
    itemStyle: {
      color: 'rgba(0, 0, 0, 0.1)' // 无数据部分颜色设为半透明
    }
  };

  const finalData = [];

  if (dataCount === 0) {
    finalData.push({...emptyData, value: emptyValue});
  } else {
    // 处理第一个数据项之前的无数据部分
    const firstEmptyValue = data[0].base_position > 1? (data[0].base_position - 1) / totalPositions * emptyValue : 0;
    if (firstEmptyValue > 0) {
      finalData.push({...emptyData, value: firstEmptyValue});
    }

    for (let i = 0; i < dataCount; i++) {
      finalData.push(data[i]);
      if (i < dataCount - 1) {
        const gap = data[i + 1].base_position - data[i].base_position - 1;
        const gapEmptyValue = gap / totalPositions * emptyValue;
        if (gapEmptyValue > 0) {
          finalData.push({...emptyData, value: gapEmptyValue});
        }
      }
    }

    // 处理最后一个数据项之后的无数据部分
    const lastEmptyValue = totalPositions - data[dataCount - 1].base_position > 0? (totalPositions - data[dataCount - 1].base_position) / totalPositions * emptyValue : 0;
    if (lastEmptyValue > 0) {
      finalData.push({...emptyData, value: lastEmptyValue});
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
</style>