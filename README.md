# QuankLink 短链接管理系统前端

QuankLink 是一个简洁高效的短链接生成和管理系统，帮助用户将长链接转换为简短易记的短链接。本仓库包含系统的前端部分。

## 功能特点

- **链接缩短**：快速将长 URL 转换为短链接
- **自定义过期时间**：设置链接的有效期
- **用户友好界面**：简洁直观的操作体验
- **管理后台**：管理员可查看和管理所有链接
- **Mock 数据**：内置模拟数据，无需后端即可运行演示

## 技术栈

- **框架**：Vue 3
- **UI 组件库**：Element Plus
- **状态管理**：Vue Reactive API
- **路由**：Vue Router
- **HTTP 请求**：Axios
- **构建工具**：Vite
- **模拟数据**：内置 Mock 服务

## 安装与运行

### 环境要求

- Node.js 16+
- npm

### 安装依赖

```bash
# 进入项目目录
cd front

# 安装依赖
npm install
```

### 运行开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
front/
├── public/             # 静态资源
├── src/
│   ├── api/            # API 请求模块
│   │   └── index.js    # API 接口定义和 Mock 实现
│   ├── assets/         # 项目资源文件
│   ├── components/     # 通用组件
│   ├── router/         # 路由配置
│   ├── views/          # 页面视图
│   │   ├── AdminPanel.vue     # 管理后台
│   │   ├── LoginPage.vue      # 登录页面
│   │   └── UserPanel.vue      # 用户主页
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
└── index.html          # HTML 模板
```

## Mock 功能说明

本项目内置了 Mock 功能，可以在没有实际后端服务的情况下进行前端开发和演示：

1. **登录验证**：模拟用户登录过程，不需要实际的身份验证服务
2. **短链生成**：模拟短链接的生成和存储功能
3. **链接管理**：模拟后端的链接列表查询、删除等操作

所有模拟数据存储在浏览器的 localStorage 中，刷新页面后数据依然保留。

### Mock 实现位置

Mock 功能主要实现在以下文件中：

- `src/api/index.js` - 包含所有 API 接口的 Mock 实现和实际 API 调用（被注释掉）
- `src/views/LoginPage.vue` - 包含登录验证的 Mock 实现

### 切换到真实后端

要将项目从 Mock 数据切换到真实后端 API，需要进行以下修改：

1. 在 `src/api/index.js` 中：
   - 更新 `baseURL` 为实际的 API 服务器地址
   ```javascript
   const api = axios.create({
       baseURL: 'https://你的实际API地址/v1', // 修改为你的实际API地址
       timeout: 10000
   })
   ```

2. 在各 API 方法中：
   - 注释掉 Mock 响应代码块
   - 取消注释实际 API 调用代码
   ```javascript
   // 例如在 createShortLink 方法中：
   
   // 注释掉 Mock 响应代码
   /*
   return new Promise((resolve) => {
       setTimeout(() => {
           resolve({
               code: 0,
               message: '创建成功',
               data: generateMockShortLink()
           })
       }, 500)
   })
   */
   
   // 取消注释实际 API 调用
   return api.post('/quank-links', data)
   ```

3. 在 `src/views/LoginPage.vue` 中：
   - 替换 Mock 登录逻辑为实际的登录 API 调用，修改 handleLogin 函数：
   ```javascript
   // 将 Mock 登录代码：
   setTimeout(() => {
     const token = 'mock_admin_token_' + Date.now()
     localStorage.setItem('admin_token', token)
     // ...其余代码
   }, 1000)
   
   // 替换为实际 API 调用：
   try {
     const result = await api.post('/login', {
       username: loginForm.username,
       password: loginForm.password
     })
     
     if (result.code === 0) {
       localStorage.setItem('admin_token', result.data.token)
       localStorage.setItem('admin_user', loginForm.username)
       // ...其余代码不变
     } else {
       ElMessage.error(result.message || '登录失败')
     }
   } catch (error) {
     ElMessage.error('登录失败，请检查网络连接')
   }
   ```

这样修改后，项目将使用真实的后端 API 而非 Mock 数据。

## 使用说明

### 前台用户界面

1. 在主页输入需要缩短的链接
2. 可选择设置过期时间
3. 点击"缩短"按钮生成短链接
4. 生成后可以直接点击短链接进行复制

### 管理员后台

1. 通过登录页面进行身份验证（演示模式下任意用户名密码均可登录）
2. 在管理后台可以查看所有链接
3. 支持链接的查询、删除等操作

## 许可证

MIT

## 联系方式

如有问题或建议，请联系项目维护者。 
