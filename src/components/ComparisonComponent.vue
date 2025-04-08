<template>
  <div class="Com-container">
    <el-card class="card-Com">
      <h1>线粒体详细信息</h1>

      <div v-if="loading" class="loading">
        <p>加载中...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <div v-else>
        <!-- 给 el-tabs 添加 ref -->
        <el-tabs type="border-card" ref="tabsRef" v-model="activeTab">
          <el-tab-pane label="目标样本" name="target-sample">
            <!-- 左侧列表 -->
            <div class="left-panel" style="flex: 1;">
              <div class="search-bar">
                <input
                    type="text"
                    class="form-control"
                    v-model="searchQuery1"
                    placeholder="搜索样本名..."
                />
              </div>
              <!-- 设置固定高度并添加滚动条 -->
              <div class="table-container">
                <table class="table">
                  <thead>
                  <tr>
                    <th>目标样本名</th>
                    <th>原始数据名</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="detail in paginatedDetails1"
                      :key="detail.original_data_name"
                      @click="handleLeftSelect(detail.original_data_name,detail.sample_name)"
                      :class="{'selected-row': selectedSampleLeft === detail.original_data_name}"
                  >
                    <td>{{ detail.sample_name }}</td>
                    <td>{{ detail.original_data_name }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>

              <nav class="page">
                <el-button @click="prevPage1" :disabled="currentPage1 === 1">
                  上一页
                </el-button>
                <span>第 {{ currentPage1 }} 页，共 {{ totalPages1 }} 页</span>
                <el-button @click="nextPage1" :disabled="currentPage1 === totalPages1">
                  下一页
                </el-button>
              </nav>
            </div>
          </el-tab-pane>
          <el-tab-pane label="比对样本" name="compare-sample">
            <!-- 右侧列表 -->
            <div class="right-panel" style="flex: 1;">
              <div class="search-bar">
                <input
                    type="text"
                    class="form-control"
                    v-model="searchQuery2"
                    placeholder="搜索样本名..."
                />
              </div>
              <!-- 设置固定高度并添加滚动条 -->
              <div class="table-container">
                <table class="table">
                  <thead>
                  <tr>
                    <th>对比样本名</th>
                    <th>原始数据名</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="detail in paginatedDetails2"
                      :key="detail.original_data_name"
                      @click="handleRightSelect(detail.original_data_name,detail.sample_name)"
                      :class="{'selected-row': selectedSampleRight === detail.original_data_name}"
                  >
                    <td>{{ detail.sample_name }}</td>
                    <td>{{ detail.original_data_name }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>

              <nav class="page">
                <el-button @click="prevPage2" :disabled="currentPage2 === 1">
                  上一页
                </el-button>
                <span>第 {{ currentPage2 }} 页，共 {{ totalPages2 }} 页</span>
                <el-button @click="nextPage2" :disabled="currentPage2 === totalPages2">
                  下一页
                </el-button>
              </nav>
            </div>
          </el-tab-pane>
          <el-tab-pane label="样本信息" name="sample-info">
            <template #header>
              <div class="card-header">样本信息</div>
            </template>
            <div>
              <el-row>
                <el-col :span="12">
                  <h4>目标样本</h4>
                  <el-alert
                      v-if="!selectedLeft"
                      title="未选择"
                      type="warning"
                      closable
                  ></el-alert>
                  <el-tag
                      v-else
                      @click="handleCancelLeftSelect"
                      closable
                      effect="light"
                      type="primary"
                  >
                    {{ selectedLeft }}
                  </el-tag>
                </el-col>
                <el-col :span="12">
                  <h4>对比样本</h4>
                  <el-alert
                      v-if="!selectedRight"
                      title="未选择"
                      type="warning"
                      closable
                  ></el-alert>
                  <el-tag
                      v-else
                      @click="handleCancelRightSelect"
                      closable
                      effect="light"
                      type="success"
                  >
                    {{ selectedRight }}
                  </el-tag>
                </el-col>
              </el-row>
              <el-button class="compare-button" @click="toCom">对比</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
// 引入 ElementPlus 组件
import { ElTabs, ElTabPane,  ElRow, ElCol, ElAlert, ElTag } from 'element-plus'

// 全局数据
const details = ref([])
const loading = ref(true)
const error = ref(null)

// 左侧表格相关变量
const searchQuery1 = ref('')
const currentPage1 = ref(1)
const itemsPerPage1 = 5
const selectedSampleLeft = ref(null)
const selectedLeft = ref(null)

// 右侧表格相关变量
const searchQuery2 = ref('')
const currentPage2 = ref(1)
const itemsPerPage2 = 5
const selectedSampleRight = ref(null)
const selectedRight = ref(null)

const router = useRouter()

// 引用 el-tabs 组件
const tabsRef = ref(null)
// 新增 activeTab 来控制当前激活的标签页
const activeTab = ref('target-sample')

// 获取数据
const fetchData = async () => {
  try {
    const response = await axios.get('/table/getMitochondrialDetailAll')
    details.value = response.data.data
    loading.value = false
  } catch (err) {
    loading.value = false
    error.value = '获取数据失败: ' + (err.response?.data?.message || err.message)
  }
}

const toCom = () => {
  if (selectedSampleLeft.value!== null && selectedSampleRight.value!== null) {
    router.push({ path: `/twoComComponent`, query: { sampleName1: selectedSampleLeft.value, sampleName2: selectedSampleRight.value,selectedLeft:selectedLeft.value,selectedRight:selectedRight.value } })
  } else {
    alert("请将数据选择完善！")
  }
}

// 选择处理函数
const handleLeftSelect = (sampleName,sampleName1) => {
  // 如果当前点击的样本名已经被选中，则取消选择
  if (selectedSampleLeft.value === sampleName) {
    selectedSampleLeft.value = null
    selectedLeft.value = null
  } else {
    selectedSampleLeft.value = sampleName
    selectedLeft.value = sampleName1
    // 切换到下一个标签页
    activeTab.value = 'compare-sample'
  }
}

const handleRightSelect = (sampleName,sampleName1) => {
  // 如果当前点击的样本名已经被选中，则取消选择
  if (selectedSampleRight.value === sampleName) {
    selectedSampleRight.value = null
    selectedRight.value = null
  } else {
    selectedSampleRight.value = sampleName
    selectedRight.value = sampleName1
    // 切换到样本信息标签页
    activeTab.value = 'sample-info'
  }
}


const handleCancelLeftSelect = () => {
  selectedSampleLeft.value = null
}

const handleCancelRightSelect = () => {
  selectedSampleRight.value = null
}

// 左侧表格计算属性
const filteredDetails1 = computed(() => {
  return details.value.filter(detail => {
    return detail.sample_name.includes(searchQuery1.value) && detail.original_data_name!== selectedSampleRight.value
  })
})

const paginatedDetails1 = computed(() => {
  const start = (currentPage1.value - 1) * itemsPerPage1
  const end = start + itemsPerPage1
  return filteredDetails1.value.slice(start, end)
})

const totalPages1 = computed(() => {
  return Math.ceil(filteredDetails1.value.length / itemsPerPage1)
})

// 右侧表格计算属性
const filteredDetails2 = computed(() => {
  return details.value.filter(detail => {
    return detail.sample_name.includes(searchQuery2.value) && detail.original_data_name!== selectedSampleLeft.value
  })
})

const paginatedDetails2 = computed(() => {
  const start = (currentPage2.value - 1) * itemsPerPage2
  const end = start + itemsPerPage2
  return filteredDetails2.value.slice(start, end)
})

const totalPages2 = computed(() => {
  return Math.ceil(filteredDetails2.value.length / itemsPerPage2)
})

// 分页控制函数
const prevPage1 = () => {
  if (currentPage1.value > 1) currentPage1.value--
}

const nextPage1 = () => {
  if (currentPage1.value < totalPages1.value) currentPage1.value++
}

const prevPage2 = () => {
  if (currentPage2.value > 1) currentPage2.value--
}

const nextPage2 = () => {
  if (currentPage2.value < totalPages2.value) currentPage2.value++
}

// 获取 el-tab-pane 尺寸的函数
async function getTabPaneSize() {
  await nextTick();
  const tabPane = document.querySelector('.el-tab-pane');
  if (tabPane) {
    const { width, height } = tabPane.getBoundingClientRect();
    console.log(`el-tab-pane 的宽度: ${width}px，高度: ${height}px`);
    // 这里可以添加更多处理尺寸数据的逻辑
  }
}

// 初始加载
onMounted(async () => {
  await fetchData();
  await getTabPaneSize();
})
</script>

<style scoped>
.Com-container {
  width: 30%; /* 设置固定宽度 */
  padding: 20px;
  height: 70%;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.loading,
.error {
  padding: 20px;
  text-align: center;
}

.error {
  color: #dc3545;
}

.main-content {
  display: flex;
  gap: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.form-control {
  width: 95%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
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
}

.table th {
  border-bottom: 1px solid #ddd;
}

.table tr:hover {
  background-color: #fcfafa;
}

.page{
  margin-top: 10px;
}
.el-button{
  margin: 10px;
}
.el-tab-pane{
  height: 400px;
}
.card-header {
  font-size: 18px;
  font-weight: bold;
}

.el-col{
  padding: 20px;
  margin-top: 90px;
}

h4 {
  color: #333;
  font-size: 16px;
  margin-bottom: 10px;
}

.card-Com{
  margin-top: 30px;
}

</style>