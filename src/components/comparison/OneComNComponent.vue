<template>
  <div class="upload-container">
    <div class="main-content">
      <!-- 左侧上传区域 -->
      <div class="OneLeft">
        <el-card>
          <template #header>
            <h3>上传文件比对</h3>
          </template>
          <div class="drag-upload"
               @dragenter="handleDragEnter"
               @dragover="handleDragOver"
               @dragleave="handleDragLeave"
               @drop="handleDrop">
            <input type="file" ref="fileInput" @change="handleFileChange" accept="*">
            <div v-if="!selectedFile" class="upload-placeholder">
              <i class="icon-upload"></i>
              <p>拖拽或点击上传数据库数据比对</p>
            </div>
            <div v-if="selectedFile" class="file-info">
              <p title="{{ selectedFile.name }}">{{ selectedFile.name }}</p>
            </div>
          </div>
          <div class="upload-options">
            <el-radio-group v-model="uploadType">
              <el-radio label="whole">Excel</el-radio>
              <el-radio label="segment">Vcf</el-radio>
            </el-radio-group>
            <el-button type="primary" @click="handleUpload" @keydown.enter.prevent>确认比对</el-button>
            <el-button @click="openDialog">设置比对容差阈值</el-button>
          </div>
        </el-card>
      </div>

      <!-- 右侧表格区域，使用 RecordList 组件 -->
      <div class="OneRight">
        <el-card style="height: 100%">
          <RecordList
              :details="details"
              :type="true"
          />
        </el-card>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="设置比对容差阈值" width="500" center @close="handleDialogClose">
      <el-tag type="primary" style="margin-bottom: 10px">比对容差阈值（默认值：10）</el-tag>
      <br/>
      <el-input style="width: 60%" v-model="toleranceThreshold" placeholder="请输入比对容差阈值（默认值：10）"></el-input>
      <div style="float: right">
        <el-button type="primary" @click="handleConfirm" @keydown.enter.prevent>确认</el-button>
        <el-button @click="handleCancel" @keydown.enter.prevent>取消</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import RecordList from '../record/RecordList.vue'
import { useStore } from 'vuex'
import { ElCard, ElRadioGroup, ElRadio, ElButton, ElDialog, ElMessage } from 'element-plus';

const store = useStore()
const selectedFile = ref(null);
const uploadType = ref('whole');
const fileInput = ref(null);
const details = ref([])
const dialogVisible = ref(false);
const toleranceThreshold = ref(10)
const isConfirm = ref(false);

// 处理文件选择事件
const handleFileChange = (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    selectedFile.value = files[0];
  }
};

// 处理拖拽事件
const preventDefaults = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

const handleDragEnter = preventDefaults;
const handleDragOver = preventDefaults;
const handleDragLeave = preventDefaults;

const handleDrop = (e) => {
  preventDefaults(e);
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    selectedFile.value = files[0];
  }
};

// 处理文件上传
const handleUpload = async () => {
  if (!selectedFile.value) {
    ElMessage.error('请选择文件');
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile.value);
  formData.append('uploadType', uploadType.value);
  formData.append('num', toleranceThreshold.value)

  try {
    const response = await axios.post('/records/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const message = response.data?.message || '上传成功';
    store.commit('setDetails', response.data.data)
    details.value = response.data.data;
    ElMessage.success(message);
  } catch (error) {
    const errorMessage = error.response?.data?.message || '上传失败：未知错误';
    ElMessage.error(errorMessage);
  }
};

// 打开对话框
const openDialog = () => {
  dialogVisible.value = true;
};

// 处理对话框确认
const handleConfirm = () => {
  isConfirm.value = true;
  dialogVisible.value = false;
};

// 处理对话框取消
const handleCancel = () => {
  isConfirm.value = false;
  dialogVisible.value = false;
  toleranceThreshold.value = 10;
};

// 处理对话框关闭事件
const handleDialogClose = () => {
  if (!isConfirm.value) {
    toleranceThreshold.value = 10;
  }
  isConfirm.value = false;
};

// 监听键盘事件
const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    if (dialogVisible.value) {
      e.preventDefault();
      e.stopPropagation();
      handleConfirm();
    } else {
      e.preventDefault();
      e.stopPropagation();
      handleUpload();
    }
  }
};

onMounted(() => {
  if (store.state.details!= null) {
    details.value = store.state.details;
  }
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.upload-container {
  width: 100%;
  max-width: 100%;
  margin: 30px;
}

.main-content {
  display: flex;
  gap: 20px;
}

.drag-upload {
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 80px 40px;
  text-align: center;
  cursor: pointer;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.drag-upload input[type="file"] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-placeholder {
  color: #666;
}

.upload-placeholder .icon-upload {
  display: inline-block;
  width: 80px;
  height: 80px;
  background: url('@/assets/upload.png') no-repeat center;
  background-size: contain;
  margin-bottom: 20px;
}

.file-info {
  color: #333;
  margin-top: 20px;
}

.file-info p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upload-options {
  margin-top: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.OneRight {
  width: 70%;
}
</style>