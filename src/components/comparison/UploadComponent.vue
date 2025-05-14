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
      <el-radio-group v-model="uploadType">
        <el-radio label="whole">Excel</el-radio>
        <el-radio label="segment">Vcf</el-radio>
      </el-radio-group>
      <el-button type="primary" @click="handleUpload" style="width: 30%">确认</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref ,defineProps} from 'vue'
import axios from 'axios'
import {ElMessage} from "element-plus";
const props = defineProps({
  onUploadSuccess: {
    type: Function,
    default: () => {}
  }
})

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
    ElMessage.error('请选择文件');
    return;
  }

  const confirmResult = confirm('是否将该样本入库？(注意：未入库的临时数据，不可从历史记录查看详情！)');
  if (confirmResult) {
    flag.value = true;
  }

  const formData = new FormData();
  formData.append('file', file.value);
  formData.append('uploadType', uploadType.value);
  formData.append('flag', flag.value);

  try {
    const response = await axios.post('/api/uploadRedis', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    props.onUploadSuccess(response.data.data);
  } catch (error) {
    console.error('文件上传失败:', error);
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

</style>