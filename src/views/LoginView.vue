<template>
  <div >
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit" >Login</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      message: '',
    };
  },
  methods: {
    async login() {
      console.log(1)
      try {
        const response = await axios.post('/api/auth/login', {
          username: this.username,
          password: this.password,
        });
        localStorage.setItem('token', response.data); // 存储 token
        this.$emit('login-success'); // 触发登录成功事件
        this.$router.push('/'); // 跳转到首页
      } catch (error) {
        this.message = 'Login failed!';
      }
    },
  },
};
</script>

<style scoped>
div {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #369f6e;
}

p {
  color: red;
}
</style>