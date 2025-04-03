<template>
      <RecordList
          :details="details"
          :type="false"
      />
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

</style>