<template>
  <div class="record-list-container">
    <el-input v-model="searchQuery" placeholder="搜索目标样本..." style="width: 97%; margin-bottom: 20px;"></el-input>
    <el-table :data="paginatedDetails" v-if="filteredDetails.length > 0">
      <el-table-column prop="time" label="分析日期" :formatter="formatDate"></el-table-column>
      <el-table-column prop="goal_name" label="目标样本名"></el-table-column>
      <el-table-column prop="compare_name" label="比对样本名"></el-table-column>
      <el-table-column prop="allowance" label="容差"></el-table-column>
      <el-table-column label="操作" v-if="type">
        <template #default="scope">
          <el-button type="primary" @click="toCom(scope.row.original_goal, scope.row.original_compare, scope.row.goal_name, scope.row.compare_name)">查看信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <p v-else>没有找到匹配的数据。</p>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10]"
        :page-size="itemsPerPage"
        layout="total, sizes, prev, pager, next"
        :total="filteredDetails.length"
        v-if="totalPages > 1"
        style="margin-top: 20px"
    >
    </el-pagination>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { ElInput, ElTable, ElTableColumn, ElButton, ElPagination } from 'element-plus';

// 接收父组件传递的数据
const props = defineProps({
  details: {
    type: Array,
    default: () => []
  },
  type: {
    type: Boolean,
    default: true
  }
});

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(5);
const router = useRouter();

const formatDate = (row, column, cellValue) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(cellValue).toLocaleDateString('zh-CN', options);
};

const toCom = (sampleName1, sampleName2, selectedLeft, selectedRight) => {
  router.push({ path: `/twoComComponent`, query: { sampleName1: sampleName1, sampleName2: sampleName2, selectedRight: selectedRight, selectedLeft: selectedLeft } });
};

const handleSizeChange = (newSize) => {
  itemsPerPage.value = newSize;
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
};

// 计算属性
const filteredDetails = computed(() => {
  const filtered = props.details.filter(detail => {
    return detail.goal_name.includes(searchQuery.value);
  });
  // 按照 allowance 从小到大排序
  return filtered.sort((a, b) => a.allowance - b.allowance);
});

const paginatedDetails = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredDetails.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredDetails.value.length / itemsPerPage.value);
});
</script>

<style scoped>
.record-list-container {
  width: 100%;
  max-width: 100%;
  margin: 20px;
}
</style>