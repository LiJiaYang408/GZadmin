<template>
  <div class="upload-container">
    <div 
      class="drop-area"
      @dragover.prevent="onDragOver"
      @dragleave="onDragLeave"
      @drop.prevent="onDrop"
      :class="{ 'drag-active': isDragging }"
    >
      <input
        type="file"
        ref="fileInput"
        @change="handleFileSelect"
        style="display: none"
        accept=".xlsx,.xls,.csv"
      />
      <p>将文件拖拽至此区域或<em @click="triggerFileInput">点击选择文件</em></p>
      <p v-if="selectedFile">已选择文件：{{ selectedFile.name }}</p>
    </div>
    <button @click="uploadFile" :disabled="!selectedFile">上传到数据库</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const fileInput = ref(null);
const selectedFile = ref(null);
const isDragging = ref(false);

const triggerFileInput = () => {
  fileInput.value.click();
};

const onDragOver = (event) => {
  isDragging.value = true;
  event.dataTransfer.dropEffect = 'copy';
};

const onDragLeave = () => {
  isDragging.value = false;
};

const onDrop = (event) => {
  isDragging.value = false;
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    selectedFile.value = files[0];
  }
};

const handleFileSelect = (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    selectedFile.value = files[0];
  }
};

const uploadFile = async () => {
  if (!selectedFile.value) return;
  
  const formData = new FormData();
  formData.append('file', selectedFile.value);

  try {
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('上传成功:', response.data);
    alert('文件上传成功，数据已存储到数据库');
    selectedFile.value = null;
  } catch (error) {
    console.error('上传失败:', error);
    alert('文件上传失败，请检查文件格式');
  }
};
</script>

<style scoped>
/* 保持原有样式不变 */
.upload-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 20px;
}

.drop-area {
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 1rem;
}

.drag-active {
  border-color: #409eff;
  background-color: #f0f7ff;
}

/* 其余样式保持不变... */
</style>

