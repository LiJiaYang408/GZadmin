<template>
  <div class="containerSiteInfo">
    <el-card class="custom-card">
      <template #header>
        <h1>位点信息 - 样本: {{ sampleName }}</h1>
      </template>
      <el-input
          v-model="searchQuery"
          placeholder="搜索碱基位置信息..."
          class="search-bar"
      />
      <el-table :data="filteredSites" stripe>
        <el-table-column prop="base_position" label="碱基位置"></el-table-column>
        <el-table-column prop="reference_base" label="参考碱基"></el-table-column>
        <el-table-column prop="mutant_base" label="突变碱基"></el-table-column>
        <el-table-column prop="total_depth" label="总深度"></el-table-column>
        <el-table-column prop="heterogeneity" label="异质性">
          <template #default="{ row }">
            {{ row.heterogeneity }}%
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
      </el-table>
      <div class="pagination-button-container">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
        :page-size="itemsPerPage"
        :total="totalItems"
        prev-text="上一页"
        next-text="下一页"
        >
        <template #total>共 {{ totalItems }}条</template> <!-- 自定义 Total 显示 -->
        <template #jumper>
          前往
          <el-input-number
              v-model="currentPage"
              :min="1"
              :max="Math.ceil(totalItems / itemsPerPage)"
              size="small"
          />
          页
        </template>
        </el-pagination>
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import router from "@/router"
import axios from "axios"

// 获取路由参数
const route = useRoute()
const sampleName = route.query.sampleName

// 响应式数据
const sites = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10) // 初始每页数量

// 生命周期
onMounted(() => {
  fetchData()
})

// 方法定义
const fetchData = async () => {
  try {
    const response = await axios.get(`/table/getMitochondrialDetailDetails?name=${sampleName}`)
    sites.value = response.data.data
  } catch (err) {
    console.error('获取数据失败:', err)
  }
}

const goBack = () => {
  router.go(-1)
}

const handleSizeChange = (newSize) => {
  itemsPerPage.value = newSize
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
}

// 计算属性
const filteredSites = computed(() => {
  return sites.value
      .filter(site => site.original_data_name === sampleName)
      .filter(site => {
        const query = searchQuery.value.toLowerCase()
        return site.base_position.toString().toLowerCase().includes(query)
      })
      .slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value)
})

const totalItems = computed(() => {
  return sites.value.filter(site => site.original_data_name === sampleName).length
})
</script>

<style scoped>
.containerSiteInfo {
  width: 80%; /* 占父容器宽度的 80% */
  margin: 0 auto; /* 水平居中 */
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.custom-card {
  box-shadow: none; /* 去除 el-card 的阴影 */
}

.pagination-button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
</style>