<template>
  <div id="app">
    <!-- 路由视图 -->
    <router-view/>
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

  },
  methods: {},
};
</script>

<style>
#app {
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

nav {
  margin-bottom: 20px;
}

nav a {
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