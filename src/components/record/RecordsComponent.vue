<template>

  <div class="Rec-container">
    <el-card class="card-h1">
      <h1 >比对记录</h1>
      <RecordListTime
          :details="details"
          :type="false"/>
    </el-card>
  </div>

</template>

<script setup>
import {onMounted, ref} from 'vue'
import axios from "axios";
import RecordListTime from "@/components/record/RecordListTime"; // 引入 RecordList 组件

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
  margin: 0 auto;
  width: 70%;
}

.card-h1{
  margin-top: 30px;
  padding-right: 40px;
  min-width: 900px;
}
</style>