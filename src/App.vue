<template>
  <div id="app">
    <!-- 导航栏 -->
    <nav v-if="isAuthenticated">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <button @click="logout">Logout</button>
    </nav>

    <!-- 路由视图 -->
    <router-view @login-success="checkAuth" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isAuthenticated: false, // 用户是否已登录
    };
  },
  created() {
    this.checkAuth(); // 检查用户是否已登录
  },
  methods: {
    // 检查用户是否已登录
    checkAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    },

    // 用户注销
    logout() {
      localStorage.removeItem('token'); // 移除 token
      this.isAuthenticated = false; // 更新登录状态
      this.$router.push('/login'); // 跳转到登录页面
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

nav {
  margin-bottom: 20px;
}

nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

button {
  background: none;
  border: none;
  color: #2c3e50;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  color: #42b983;
}
</style>