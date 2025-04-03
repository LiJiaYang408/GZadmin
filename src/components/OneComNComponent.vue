<template>
  <div class="upload-container">
    <div class="main-content">
      <!-- 左侧上传区域 -->
      <div class="left-panel">
        <h3>上传文件比对</h3>
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
          <label>
            <input type="radio" v-model="uploadType" value="whole">Excel
          </label>
          <label>
            <input type="radio" v-model="uploadType" value="segment">Vcf
          </label>
          <button class="confirm-btn" @click="handleUpload">确认上传</button>
        </div>
      </div>

      <!-- 右侧表格区域，使用 RecordList 组件 -->
      <RecordList
          :details="details"
      />
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import RecordList from './RecordList.vue'
import { useStore } from 'vuex'

const store = useStore()
const selectedFile = ref(null);
const uploadType = ref('whole');
const fileInput = ref(null);
const details = ref([])

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
    alert('请选择文件');
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile.value);
  formData.append('uploadType', uploadType.value);

  try {
    const response = await axios.post('/records/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const message = response.data?.message || '上传成功';
    store.commit('setDetails', response.data.data)
    details.value= response.data.data
    alert(message);
  } catch (error) {
    const errorMessage = error.response?.data?.message || '上传失败：未知错误';
    alert(errorMessage);
  }
};

// 生命周期
onMounted(() => {
  if (store.state.details!=null){
    details.value=store.state.details

  }
})
</script>


<style scoped>
.upload-container {
  width: 100%;
  max-width: 100%;
  margin: 20px;
}

.main-content {
  display: flex;
  gap: 20px;
}

.left-panel {
  width: 18%;
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

.upload-options label {
  margin-right: 0;
}

.confirm-btn {
  padding: 8px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.confirm-btn:hover {
  background-color: #45a049;
}
</style>