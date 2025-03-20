<template>
  <div class="container">
    <h1>位点信息 - 样本: {{ sampleName }}</h1>

    <div class="search-bar">
      <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="搜索位点信息..."
      />
    </div>
    <table class="table">
      <thead>
      <tr>
        <th>碱基位置</th>
        <th>参考碱基</th>
        <th>突变碱基</th>
        <th>总深度</th>
        <th>异质性</th>
        <th>类型</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="site in filteredSites" :key="site.id">
        <td>{{ site.base_position }}</td>
        <td>{{ site.reference_base }}</td>
        <td>{{ site.mutant_base }}</td>
        <td>{{ site.total_depth }}</td>
        <td>{{ site.heterogeneity }}%</td>
        <td>{{ site.type }}</td>
      </tr>
      </tbody>
    </table>
    <nav v-if="totalPages > 1" class="pagination">
      <button class="btn btn-outline-primary" @click="prevPage" :disabled="currentPage === 1">
        上一页
      </button>
      <span>第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
      <button class="btn btn-outline-primary" @click="nextPage" :disabled="currentPage === totalPages">
        下一页
      </button>
      <button class="btn-back" @click="goBack">
        返回
      </button>
    </nav>
  </div>
</template>

<script>
import {ref, computed, onMounted} from 'vue'
import { useRoute } from 'vue-router'
import router from "@/router";
import axios from "axios";

export default {
  setup() {
    const route = useRoute()

    // 获取路由中的样本名
    const sampleName = route.query.sampleName

    // 位点信息数据
    const sites = ref([])
    // 从后端获取数据
    const fetchData = async () => {
        const response = await axios.get('/table/getMitochondrialDetailDetails?name='+sampleName)
        sites.value = response.data.data
    }
    // 搜索查询
    const searchQuery = ref('')

    // 分页相关
    const currentPage = ref(1)
    const itemsPerPage = 10

    // 计算属性：过滤后的位点列表
    const filteredSites = computed(() => {
      return sites.value
          .filter(site => site.sample_name === sampleName)
          .filter(site => {
            return (
                site.base_position.toString().includes(searchQuery.value) ||
                site.reference_base.includes(searchQuery.value) ||
                site.mutant_base.includes(searchQuery.value) ||
                site.total_depth.toString().includes(searchQuery.value) ||
                site.heterogeneity.toString().includes(searchQuery.value) ||
                site.type.includes(searchQuery.value)
            )
          })
          .slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage)
    })

    // 计算属性：总页数
    const totalPages = computed(() => {
      return Math.ceil(
          sites.value.filter(site => site.sample_name === sampleName).length / itemsPerPage
      )
    })

    // 返回上一个页面
    const goBack = () => {
      router.go(-1)
    }

    // 上一页
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    // 下一页
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    onMounted(()=>{
      fetchData()
    })

    return {
      sampleName,
      searchQuery,
      filteredSites,
      currentPage,
      totalPages,
      prevPage,
      nextPage,
      goBack
    }
  }
}
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  padding: 20px;
  border-radius: 8px;
  height: 770px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th,
.table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.btn-back {
  margin-right: 20px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}


.table tr:hover {
  background-color: #f1f1f1;
}

.btn {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
  text-decoration: none;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.search-bar {
  margin-bottom: 20px;
}

.form-control {
  width: 1170px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
}
</style>

