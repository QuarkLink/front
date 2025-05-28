<template>
  <div id="app">
    <el-container>
      <el-header class="header">
        <div class="header-content">
          <div class="logo">
            <el-icon class="logo-icon"><Link /></el-icon>
            <span>QuankLink</span>
          </div>
          <div class="nav">
            <template v-if="isAdmin">
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="user-dropdown-link">
                  <el-icon><User /></el-icon>
                  {{ userName }}
                  <el-icon><ArrowDown /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <template v-if="isAdminRoute">
                      <el-dropdown-item command="home">
                        <el-icon><HomeFilled /></el-icon>
                        返回首页
                      </el-dropdown-item>
                      <el-dropdown-item divided command="logout">
                        <el-icon><SwitchButton /></el-icon>
                        退出登录
                      </el-dropdown-item>
                    </template>
                    <template v-else>
                      <el-dropdown-item command="admin">
                        <el-icon><Setting /></el-icon>
                        进入管理后台
                      </el-dropdown-item>
                      <el-dropdown-item divided command="logout">
                        <el-icon><SwitchButton /></el-icon>
                        退出登录
                      </el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <template v-else>
              <router-link :to="{ path: '/login', query: { redirect: $route.fullPath } }" class="nav-item">登录</router-link>
            </template>
          </div>
        </div>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isAdmin: false,
      isAdminRoute: false,
      isUserRoute: false,
      userName: ''
    }
  },
  created() {
    // 监听登录状态变化
    window.addEventListener('storage', this.checkLoginStatus)
    // 监听自定义登录状态变化事件
    window.addEventListener('login-state-changed', this.checkLoginStatus)
    this.checkLoginStatus()
    this.checkCurrentRoute()
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.checkLoginStatus)
    window.removeEventListener('login-state-changed', this.checkLoginStatus)
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('admin_token')
      const user = localStorage.getItem('admin_user')
      this.isAdmin = !!token
      this.userName = user || '用户'
    },
    handleLogout() {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      this.isAdmin = false
      this.userName = ''
      
      // 如果当前在管理页面，跳转到首页
      if (this.$route.path === '/admin') {
        this.$router.push('/')
      }
    },
    checkCurrentRoute() {
      this.isAdminRoute = this.$route.path === '/admin'
      this.isUserRoute = this.$route.path === '/'
      
      // 根据路由设置body样式
      if (this.isUserRoute) {
        document.body.classList.add('user-page')
      } else {
        document.body.classList.remove('user-page')
      }
    },
    handleCommand(command) {
      if (command === 'logout') {
        this.handleLogout()
      } else if (command === 'admin') {
        this.$router.push('/admin')
      } else if (command === 'home') {
        this.$router.push('/')
      }
    }
  },
  watch: {
    $route() {
      this.checkLoginStatus()
      this.checkCurrentRoute()
    }
  }
}
</script>

<style>
html, 
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  height: 100%;
}

body.user-page {
  overflow: hidden;
}

#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  height: 100%;
  background: #ffffff;
  position: relative;
  overflow: hidden;
}

.el-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  overflow-y: auto;
  padding: 0 !important;
}

body.user-page .main {
  overflow: hidden;
}

.header {
  background: #1e2146;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
  height: 90px;
  line-height: 90px;
}

.el-header {
  padding: 0;
  height: 90px !important;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  height: 90px;
}

.logo-icon {
  background: #6c5ce7;
  border-radius: 50%;
  padding: 8px;
  font-size: 18px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 24px;
  height: 90px;
}

.nav-item {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 4px;
  transition: all 0.3s;
  font-size: 16px;
}

.nav-item:hover {
  color: #fff;
}

.language-selector {
  display: flex;
  align-items: center;
}

.flag-icon {
  width: 24px;
  height: 18px;
  object-fit: cover;
}

.user-dropdown-link {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  padding: 10px 18px;
  border-radius: 6px;
  transition: all 0.3s;
  font-weight: 500;
  height: 44px;
  font-size: 16px;
}

.user-dropdown-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

* {
  box-sizing: border-box;
}
</style> 
