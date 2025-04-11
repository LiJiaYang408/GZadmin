<template>
  <div class="record-list-container">
    <!-- 使用日期选择器替换输入框 -->
    <el-date-picker
        v-model="searchDate"
        type="date"
        placeholder="选择查询日期..."
        style="width: 100%; margin-bottom: 20px;"
    ></el-date-picker>
    <!-- 添加滚动容器 -->
    <div class="scroll-container" v-if="groupedFilteredDetails.length > 0">
      <el-collapse :accordion="false" :model-value="openedItems">
        <el-collapse-item
            v-for="(group, index) in paginatedGroupedDetails"
            :key="index"
            :name="index.toString()"
            :title="group.timeGroup"
        >
          <el-table :data="group.details">
            <el-table-column prop="time" label="分析日期" :formatter="formatDate"></el-table-column>
            <el-table-column prop="goal_name" label="目标样本名"></el-table-column>
            <el-table-column prop="compare_name" label="比对样本名"></el-table-column>
            <el-table-column prop="allowance" label="容差"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="primary" @click="toCom(scope.row.original_goal, scope.row.original_compare, scope.row.goal_name, scope.row.compare_name)">查看信息</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <p v-else>没有找到匹配的数据。</p>
    <el-pagination
        @size-change="handleGroupSizeChange"
        @current-change="handleGroupCurrentChange"
        :current-page="groupCurrentPage"
        :page-sizes="[3, 5]"
        :page-size="groupItemsPerPage"
        layout="total, sizes, prev, pager, next"
        :total="groupedFilteredDetails.length"
        v-if="groupTotalPages > 1"
        style="margin-top: 20px"
    >
    </el-pagination>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElDatePicker, ElTable, ElTableColumn, ElButton, ElPagination, ElCollapse, ElCollapseItem } from 'element-plus';

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

// 替换 searchQuery 为 searchDate
const searchDate = ref(null);
const router = useRouter();
const openedItems = ref([]);
const groupCurrentPage = ref(1);
const groupItemsPerPage = ref(3);

const formatDate = (row, column, cellValue) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(cellValue).toLocaleDateString('zh-CN', options);
};

const toCom = (sampleName1, sampleName2, selectedLeft, selectedRight) => {
  router.push({ path: `/twoComComponent`, query: {flag: "false", sampleName1: sampleName1, sampleName2: sampleName2, selectedRight: selectedRight, selectedLeft: selectedLeft } });
};

const handleGroupSizeChange = (newSize) => {
  groupItemsPerPage.value = newSize;
};

const handleGroupCurrentChange = (newPage) => {
  groupCurrentPage.value = newPage;
  // 关闭所有折叠框
  closeAllItems();
};

// 修改过滤逻辑，根据日期进行过滤
const filteredDetails = computed(() => {
  const detailsCopy = [...props.details]; // 复制一份 props.details
  if (!searchDate.value) {
    return detailsCopy.sort((a, b) => new Date(b.time) - new Date(a.time));
  }
  const searchDateObj = new Date(searchDate.value);
  const filtered = detailsCopy.filter(detail => {
    const detailDate = new Date(detail.time);
    return (
        detailDate.getFullYear() === searchDateObj.getFullYear() &&
        detailDate.getMonth() === searchDateObj.getMonth() &&
        detailDate.getDate() === searchDateObj.getDate()
    );
  });
  return filtered.sort((a, b) => new Date(b.time) - new Date(a.time));
});

const groupedFilteredDetails = computed(() => {
  const groups = {};
  filteredDetails.value.forEach(detail => {
    const timeGroup = new Date(detail.time).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' });
    if (!groups[timeGroup]) {
      groups[timeGroup] = { timeGroup, details: [] };
    }
    groups[timeGroup].details.push(detail);
  });
  return Object.values(groups).sort((a, b) => new Date(b.timeGroup) - new Date(a.timeGroup));
});

const paginatedGroupedDetails = computed(() => {
  const start = (groupCurrentPage.value - 1) * groupItemsPerPage.value;
  const end = start + groupItemsPerPage.value;
  return groupedFilteredDetails.value.slice(start, end);
});

const groupTotalPages = computed(() => {
  return Math.ceil(groupedFilteredDetails.value.length / groupItemsPerPage.value);
});

// 根据 type 的值判断是否展开
const openAllItems = () => {
  openedItems.value = groupedFilteredDetails.value.map((_, index) => index.toString());
};

const closeAllItems = () => {
  openedItems.value = [];
};

// 使用 watch 监听 props.type 的变化
watch(() => props.type, (newType) => {
  if (newType) {
    openAllItems();
  } else {
    closeAllItems();
  }
}, { immediate: true });
</script>

<style scoped>
.record-list-container {
  width: 100%;
  max-width: 100%;
  margin: 20px;
}

.scroll-container {
  max-height: 300px; /* 可根据需要调整最大高度 */
  overflow-y: auto; /* 当内容超过最大高度时显示垂直滚动条 */
}
</style>