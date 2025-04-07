<template>

  <div class="Rec-container">
    <el-card class="card-h1">
      <h1 >比对记录</h1>
      <RecordList
          :details="details"
          :type="false"/>
    </el-card>
  </div>

</template>

<script setup>
import {onMounted, ref} from 'vue'
import RecordList from './RecordList.vue'
import axios from "axios"; // 引入 RecordList 组件

const details=ref([])

const fetchData = async () => {
    const response = await axios.get('/records/getRecords')
    details.value = response.data.data
}
// 生命周期
onMounted(() => {
  fetchData();
})

</script>

<style scoped>
.Rec-container{
  padding-right: 40px;
  margin: 0 auto;
  width: 70%;
}

.card-h1{
  margin-top: 30px;
}
</style>