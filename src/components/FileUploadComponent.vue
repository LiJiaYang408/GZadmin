<template>
  <div class="upload-container">
    <h3>文件上传</h3>
    <div class="drag-upload"
         @dragenter="handleDragEnter"
         @dragover="handleDragOver"
         @dragleave="handleDragLeave"
         @drop="handleDrop">
      <!-- 添加 multiple 属性以支持多选 -->
      <input type="file" ref="fileInput" @change="handleFileChange" accept="*" multiple>
      <div v-if="!files.length" class="upload-placeholder">
        <i class="icon-upload"></i>
        <p>拖拽或 点击上传</p>
        <span>可选择多份文件</span>
      </div>
      <div v-if="files.length" class="file-info">
        <ul>
          <!-- 循环显示选择的文件名 -->
          <li v-for="file in files" :key="file.name">{{ file.name }}</li>
        </ul>
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
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// 使用数组存储多个文件
const files = ref([]);
const uploadType = ref('whole');
const fileInput = ref(null);

// 文件选择处理
const handleFileChange = (e) => {
  // 将选择的文件转换为数组
  files.value = Array.from(e.target.files);
};

// 拖拽事件处理
const handleDragEnter = (e) => {
  e.preventDefault();
  e.stopPropagation();
};
const handleDragOver = (e) => {
  e.preventDefault();
  e.stopPropagation();
};
const handleDragLeave = (e) => {
  e.preventDefault();
  e.stopPropagation();
};
const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  // 将拖拽的文件转换为数组
  files.value = Array.from(e.dataTransfer.files);
};

// 上传处理
const handleUpload = async () => {
  if (!files.value.length) {
    alert('请选择文件');
    return;
  }

  const formData = new FormData();

  files.value.forEach((file) => {
    formData.append('file', file);
  });
  formData.append('uploadType', uploadType.value);


  try {
    const response = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (response && response.data && response.data.message) {
      alert('上传成功：' + response.data.message);
    } else {
      alert('上传成功，但响应信息格式有误');
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      alert('上传失败：' + error.response.data.message);
    } else {
      alert('上传失败：未知错误');
    }
  }
};
</script>

<style scoped>
.upload-container {
  width: 70%; /* 容器占满父级宽度 */
  max-width: 100%; /* 最大宽度限制，可按需调整 */
  margin: 20px auto;
}

.drag-upload {
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 80px 40px;
  text-align: center;
  cursor: pointer;
  position: relative;
  width: 100%; /* 上传区域占满容器宽度 */
  box-sizing: border-box; /* 确保内边距不影响宽度 */
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

.upload-options {
  margin-top: 20px;
  display: flex;
  gap: 20px;
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
}
</style>