<template>
  <div class="login-page">
    <div class="login-background"></div>
    <div class="login-content">
      <el-card class="login-card" shadow="never">
        <div class="card-header">
          <h2>登录</h2>
        </div>
        
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-position="top">
          <el-form-item label="用户名" prop="username">
            <el-input 
              v-model="loginForm.username" 
              placeholder="请输入用户名"
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
              :prefix-icon="Lock"
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loginLoading" @click="handleLogin" class="login-button">
              {{ loginLoading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
        
        <el-alert
          title="演示提示"
          type="info"
          :closable="false"
          show-icon
          class="demo-alert"
        >
          <template #default>
            <p>您可以使用任意用户名和密码登录</p>
          </template>
        </el-alert>
      </el-card>
      
      <div class="back-to-home">
        <router-link to="/">
          <el-icon><ArrowLeft /></el-icon>
          返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { User, Lock, ArrowLeft } from '@element-plus/icons-vue'

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const loginFormRef = ref(null)
    const loginLoading = ref(false)
    
    const loginForm = reactive({
      username: '',
      password: ''
    })
    
    const loginRules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    }
    
    // 登录
    const handleLogin = async () => {
      if (!loginFormRef.value) return
      
      try {
        await loginFormRef.value.validate()
        loginLoading.value = true
        
        // Mock登录验证
        setTimeout(() => {
          // 模拟登录成功
          const token = 'mock_admin_token_' + Date.now()
          localStorage.setItem('admin_token', token)
          localStorage.setItem('admin_user', loginForm.username)
          
          loginLoading.value = false
          
          ElMessage.success('登录成功！')
          
          // 触发一个自定义事件通知App组件更新导航栏
          window.dispatchEvent(new Event('login-state-changed'))
          
          // 登录成功后，返回来源页面或默认跳转到首页
          const redirect = route.query.redirect || '/'
          router.push(redirect)
        }, 1000)
        
      } catch (error) {
        loginLoading.value = false
        console.error('登录失败:', error)
      }
    }
    
    return {
      loginFormRef,
      loginForm,
      loginRules,
      loginLoading,
      handleLogin,
      User,
      Lock,
      ArrowLeft
    }
  }
}
</script>

<style scoped>
.login-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e2146, #2a305e);
  z-index: -1;
}

.login-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.login-content {
  width: 100%;
  max-width: 440px;
  padding: 0 20px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
}

.logo-icon {
  background: #6c5ce7;
  color: #fff;
  border-radius: 50%;
  padding: 8px;
  font-size: 20px;
  box-shadow: 0 4px 10px rgba(108, 92, 231, 0.3);
}

.logo-area h1 {
  color: #ffffff;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.login-card {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 10px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.card-header {
  text-align: center;
  margin-bottom: 25px;
}

.card-header h2 {
  color: #333;
  font-weight: 600;
  margin: 0 0 8px 0;
  font-size: 22px;
}

.subtitle {
  color: #666;
  margin: 0;
  font-size: 14px;
}

:deep(.el-form-item__label) {
  padding-bottom: 5px;
  font-weight: 500;
  color: #333;
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
  border: 1px solid #dcdfe6;
  transition: all 0.3s;
  border-radius: 8px;
  padding: 0 15px;
}

:deep(.el-input__wrapper:hover) {
  border-color: #2591ae;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #2591ae;
  box-shadow: 0 0 0 2px rgba(37, 145, 174, 0.1) !important;
}

:deep(.el-input__inner) {
  height: 42px;
  font-size: 14px;
}

:deep(.el-input__prefix-inner) {
  display: flex;
  align-items: center;
  color: #909399;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 15px;
  font-weight: 500;
  margin-top: 10px;
  background-color: #2591ae;
  border-color: #2591ae;
  border-radius: 8px;
  transition: all 0.3s;
}

.login-button:hover {
  background-color: #1a6d83;
  border-color: #1a6d83;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 145, 174, 0.2);
}

.demo-alert {
  margin-top: 20px;
  border-radius: 8px;
}

.back-to-home {
  margin-top: 20px;
  text-align: center;
}

.back-to-home a {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.3s;
}

.back-to-home a:hover {
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

@media (max-width: 576px) {
  .login-card {
    border-radius: 12px;
  }
  
  .card-header h2 {
    font-size: 20px;
  }
  
  .logo-area h1 {
    font-size: 24px;
  }
  
  :deep(.el-input__inner) {
    height: 40px;
  }
  
  .login-button {
    height: 42px;
  }
}
</style> 
