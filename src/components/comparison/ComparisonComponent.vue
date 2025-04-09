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
            <div class="main-content">
              <!-- 左侧列表 -->
              <div class="left-List">
                <ListComponent
                    :details="details"
                    header1="目标样本名"
                    header2="原始数据名"
                    :selectedSampleOther="selectedSampleRight"
                    @select="handleLeftSelect"
                />
              </div>
              <!-- 文件上传区域 -->
              <div class="right-Right">
                <UploadComponent />
              </div>

            </div>
          </el-tab-pane>
          <el-tab-pane label="比对样本" name="compare-sample">
            <!-- 右侧列表 -->
            <div class="main-content">
            <div class="left-List">
              <ListComponent
                  :details="details"
                  header1="对比样本名"
                  header2="原始数据名"
                  :selectedSampleOther="selectedSampleLeft"
                  @select="handleRightSelect"
              />
            </div>
              <!-- 文件上传区域 -->
              <div class="right-Right">
                <UploadComponent />
              </div>
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
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
// 引入 ElementPlus 组件
import { ElTabs, ElTabPane, ElRow, ElCol, ElAlert, ElTag, ElButton } from 'element-plus'
// 引入新的列表组件
import ListComponent from './ListComponent.vue'
// 引入文件上传组件
import UploadComponent from "@/components/comparison/UploadComponent";

// 全局数据
const details = ref([])
const loading = ref(true)
const error = ref(null)

// 左侧表格相关变量
const selectedSampleLeft = ref(null)
const selectedLeft = ref(null)

// 右侧表格相关变量
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
    router.push({
      path: `/twoComComponent`,
      query: {
        sampleName1: selectedSampleLeft.value,
        sampleName2: selectedSampleRight.value,
        selectedLeft: selectedLeft.value,
        selectedRight: selectedRight.value
      }
    })
  } else {
    alert("请将数据选择完善！")
  }
}

// 选择处理函数
const handleLeftSelect = (sampleName, sampleName1) => {
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

const handleRightSelect = (sampleName, sampleName1) => {
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
  width: 60%; /* 设置固定宽度 */
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

.el-tab-pane {
  height: 400px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.el-col {
  padding: 20px;
  margin-top: 90px;
}

h4 {
  color: #333;
  font-size: 16px;
  margin-bottom: 10px;
}

.card-Com {
  margin-top: 30px;
}

.left-List{
  width: 60%;
  margin-right: 30px;
}

.right-Right{
  width: 40%;
}
</style>