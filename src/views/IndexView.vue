<template>
  <div class="app-container">
    <!-- 头部 -->
    <header className="app-header">
      <div>
        <img class="el-header-img" src="@/assets/header.png" alt="Logo">
      </div>
    </header>

    <!-- 主体内容 -->
    <div className="app-content">
      <!-- 侧边栏 -->
      <aside className="sidebar">
        <ul className="nav-menu">
          <router-link to="/mitochondrialDetail">
            <li>
              <img src="@/assets/tabulation.png" class="el-aside-img">
              <span>表格数据</span>
            </li>
          </router-link>
          <router-link to="/fileUpload">
            <li>
              <img src="@/assets/FileUpload.png" class="el-aside-img">
              <span>数据入库</span>
            </li>
          </router-link>
          <router-link to="/comparison">
            <li>
              <img src="@/assets/comparison.png" class="el-aside-img">
              <span>比对 1/1</span>
            </li>
          </router-link>
          <router-link to="/oneComN">
            <li>
              <img src="@/assets/one-to-many.png" class="el-aside-img">
              <span>比对 1/N</span>
            </li>
          </router-link>
          <router-link to="/recordsComponent">
            <li>
              <img src="@/assets/record.png" class="el-aside-img">
              <span>比对记录</span>
            </li>
          </router-link>
        </ul>
      </aside>

      <!-- 主要内容区域 -->
      <main className="main-content">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import router from "@/router";

onMounted(() => {
  router.push("/mitochondrialDetail");
});
</script>

<style scoped>

.app-container {
  display: flex;
  flex-direction: column;
  width: 100vw; /* 使用视口宽度单位设置宽度 */
  height: 100vh; /* 使用视口高度单位设置高度 */
}

.el-header-img{
  width: 100%;
  height: 80px;
  z-index: 100;
}

.logo-container {
  display: flex;
  align-items: center;
}

.app-content {
  margin-top: -10px;
  display: flex;
  flex: 1;
  overflow: hidden;
}

.el-aside-img{
  width: 60px;
  height: 60px;
}

.sidebar {
  background-image: url("@/assets/Aside.jpg");
  color: white;
  width: 100px;
  overflow-y: auto;
}

.nav-menu {
  list-style: none;
  padding: 0;
}

.nav-menu li {
  width: 100px;
  height: 100px;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  text-align: center;
}


.nav-menu a {
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s;
}

.nav-menu a:hover {
  background-color: #0055ff;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>