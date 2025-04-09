<template>
  <div class="upload-container">
    <!-- 保持现有内容 -->
    <div class="drag-upload"
         @dragenter="handleDragEnter"
         @dragover="handleDragOver"
         @dragleave="handleDragLeave"
         @drop="handleDrop">
      <input type="file" ref="fileInput" @change="handleFileChange" accept="*">
      <div v-if="!file" class="upload-placeholder">
        <i class="icon-upload"></i>
        <p>选择单个文件进行比对</p>
      </div>
      <div v-if="file" class="file-info">
        <p>{{ getDisplayFileName(file.name) }}</p>
      </div>
    </div>
    <div class="upload-options">
      <label>
        <input type="radio" v-model="uploadType" value="whole">Excel
      </label>
      <label>
        <input type="radio" v-model="uploadType" value="segment">Vcf
      </label>
      <button class="confirm-btn" @click="handleUpload">确认</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { defineEmits } from 'vue'

const emits = defineEmits(['fileUploaded'])

const file = ref(null);
const uploadType = ref('whole');
const fileInput = ref(null);
const flag = ref(false);
const MAX_DISPLAY_NAME_LENGTH = 20;

const getDisplayFileName = (name) => {
  if (name.length > MAX_DISPLAY_NAME_LENGTH) {
    return name.slice(0, MAX_DISPLAY_NAME_LENGTH) + '...';
  }
  return name;
};

const handleFileChange = (e) => {
  file.value = e.target.files[0];
};

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
  file.value = e.dataTransfer.files[0];
};

const handleUpload = async () => {
  if (!file.value) {
    alert('请选择文件');
    return;
  }

  const confirmResult = confirm('是否将该样本入库？');
  if (confirmResult) {
    flag.value = true;
  }

  const formData = new FormData();
  formData.append('file', file.value);
  formData.append('uploadType', uploadType.value);
  formData.append('flag', flag.value);

  try {
    const response = await axios.post('/api/getUpd', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (response.data && response.data.code === 200 && response.data.data && response.data.data.body && response.data.data.body.message) {
      alert(`上传成功：${response.data.data.body.message}`);
      emits('fileUploaded', file.value.name);
    } else {
      alert('上传成功，但响应信息格式有误');
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.code!== 200 && error.response.data.message) {
      alert(`上传失败：${error.response.data.message}`);
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