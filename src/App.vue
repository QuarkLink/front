<template>
  <div id="app">
    <el-container>
      <el-header class="header">
        <div class="header-content">
          <h1 class="title">
            <el-icon><Link /></el-icon>
            短链管理系统
          </h1>
          <nav class="nav">
            <router-link to="/admin" class="nav-link">
              <el-icon><Setting /></el-icon>
              登录
            </router-link>
          </nav>
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
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
}

.title {
  margin: 0;
  color: #409eff;
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav {
  display: flex;
  gap: 24px;
}

.nav-link {
  color: #606266;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #409eff;
  background: rgba(64, 158, 255, 0.1);
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
</style> 
