<template>

  <div className="login-container">
    <!-- 左侧表单区域 -->
    <div className="login-form">
      <div className="logo-container">
        <!--        <img src="@/assets/logo.png" alt="Deep Reads Biotech Logo" className="logo">-->
        <h1 className="company-name">DEEP READS BIOTECH</h1>
      </div>

      <div className="login-content">
        <h2 className="title">FIMTA法庭科学二代测序线粒体分析比对软件</h2>
        <p className="subtitle">"十四五"拐卖人口犯罪精准识别及预警技术研究</p>

        <form class="form" @submit.prevent="handleLogin">
          <div class="form-group">
            <input
                type="text"
                class="form-control"
                placeholder="账号"
                v-model="formData.username"
                @blur="validateUsername"
            >
            <div class="error-message" v-if="errors.username">{{ errors.username }}</div>
          </div>
          <div class="form-group">
            <input
                type="password"
                class="form-control"
                placeholder="密码"
                v-model="formData.password"
                @blur="validatePassword"
            >
            <div class="error-message" v-if="errors.password">{{ errors.password }}</div>
          </div>
          <div class="form-submit">
            <button type="submit" class="btn-login" :disabled="isSubmitting">登录</button>
          </div>
        </form>

        <div className="footer">
          <p>版权所有2020 广州深晓基因科技有限公司 All Rights Reserved</p>
          <p>V1.0</p>
        </div>
      </div>
    </div>

    <!-- 右侧背景图区域 -->
    <div className="login-background">
      <img src="@/assets/loginRight.png" alt="Background" className="background-img">
    </div>
  </div>

</template>

<script>
import axios from "axios";
import router from "@/router";

export default {
  name: 'LoginView',
  data() {
    return {
      formData: {
        username: '',
        password: ''
      },
      errors: {
        username: '',
        password: ''
      },
      isSubmitting: false
    }
  },
  methods: {
    validateUsername() {
      if (!this.formData.username.trim()) {
        this.errors.username = '账号不能为空';
        return false;
      }
      this.errors.username = '';
      return true;
    },
    validatePassword() {
      if (!this.formData.password.trim()) {
        this.errors.password = '密码不能为空';
        return false;
      }
      this.errors.password = '';
      return true;
    },
    validateForm() {
      let isValid = true;

      if (!this.validateUsername()) isValid = false;
      if (!this.validatePassword()) isValid = false;

      return isValid;
    },
    async handleLogin() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;

      try {

        const response = await axios.post('/api/auth/login', this.formData, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.data.code===200){
          console.log("登录成功");
          await router.push("/home")
        }
      } catch (error) {
        console.error('登录失败:', error);
        alert('登录失败，请检查账号和密码');
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
</script>

<style scoped>

.login-container {
  display: flex;
  height: 100vh;
  width: 1885px;
}

.login-form {
  width: 50%;
  background-color: #fff;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.logo {
  height: 60px;
  margin-right: 15px;
}

.company-name {
  color: #333;
  font-size: 24px;
  font-weight: 500;
}

.login-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
}



.subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 40px;
}

.form {
  width: 300px;
  margin: auto;
}

.form-group {
  margin-bottom: 10px;
}

.form-submit{
  margin-top: 50px;
  width: 330px;
}

.form-control {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 14px;
  outline: none;
}

.btn-login {
  width: 100%;
  padding: 12px 0;
  background-color: #55ceff;
  color: #fff;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-login:hover {
  background-color: #33bbff;
}

.footer {
  text-align: center;
  font-size: 14px;
  color: #999;
  line-height: 1.8;
}

.login-background {
  width: 50%;
  overflow: hidden;
  background-color: #f0f2f5;
}

.background-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>