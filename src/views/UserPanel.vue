<template>
  <div class="user-panel">
    <el-card class="create-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Link /></el-icon>
          <span>创建短链接</span>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="原始链接" prop="origin_url">
          <el-input
            v-model="form.origin_url"
            placeholder="请输入需要缩短的链接，如：https://www.example.com"
            clearable
          >
            <template #prepend>
              <el-icon><Globe /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="过期时间" prop="expire_at">
          <el-date-picker
            v-model="expireDate"
            type="datetime"
            placeholder="选择过期时间（可选）"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled-date="disabledDate"
            style="width: 100%"
          />
          <div class="form-tip">
            不设置过期时间将使用系统默认值
          </div>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleSubmit"
            size="large"
            style="width: 100%"
          >
            <el-icon><MagicStick /></el-icon>
            {{ loading ? '生成中...' : '生成短链接' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 结果展示 -->
    <el-card v-if="result" class="result-card" shadow="hover">
      <template #header>
        <div class="card-header success">
          <el-icon class="header-icon"><SuccessFilled /></el-icon>
          <span>生成成功</span>
        </div>
      </template>
      
      <div class="result-content">
        <div class="result-item">
          <label>短链接：</label>
          <div class="link-container">
            <el-input
              :value="result.short_url"
              readonly
              class="link-input"
            >
              <template #append>
                <el-button @click="copyToClipboard(result.short_url)">
                  <el-icon><CopyDocument /></el-icon>
                  复制
                </el-button>
              </template>
            </el-input>
          </div>
        </div>
        
        <div class="result-item">
          <label>原始链接：</label>
          <div class="original-link">{{ result.origin_url }}</div>
        </div>
        
        <div class="result-item">
          <label>过期时间：</label>
          <div class="expire-time">{{ formatExpireTime(result.expire_at) }}</div>
        </div>
        
        <div class="result-actions">
          <el-button type="success" @click="openShortLink" plain>
            <el-icon><View /></el-icon>
            访问短链接
          </el-button>
          <el-button @click="resetForm" plain>
            <el-icon><RefreshLeft /></el-icon>
            重新生成
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 使用说明 -->
    <el-card class="info-card" shadow="never">
      <template #header>
        <div class="card-header info">
          <el-icon class="header-icon"><InfoFilled /></el-icon>
          <span>使用说明</span>
        </div>
      </template>
      
      <div class="info-content">
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in instructions"
            :key="index"
            :icon="item.icon"
            :type="item.type"
          >
            <h4>{{ item.title }}</h4>
            <p>{{ item.content }}</p>
          </el-timeline-item>
        </el-timeline>
        
        <div class="admin-link-container">
          <el-divider />
          <p class="admin-tip">登录后可查看和管理所有短链接</p>
          <router-link to="/admin">
            <el-button type="info" plain>
              <el-icon><Setting /></el-icon>
              进入管理后台
            </el-button>
          </router-link>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { userApi } from '../api'

export default {
  name: 'UserPanel',
  setup() {
    const formRef = ref(null)
    const loading = ref(false)
    const result = ref(null)
    const expireDate = ref('')
    
    const form = reactive({
      origin_url: '',
      expire_at: null
    })
    
    const rules = {
      origin_url: [
        { required: true, message: '请输入原始链接', trigger: 'blur' },
        {
          pattern: /^https?:\/\/.+/,
          message: '请输入有效的URL，需要包含http://或https://',
          trigger: 'blur'
        }
      ]
    }
    
    const instructions = [
      {
        title: '输入原始链接',
        content: '在上方表单中输入您想要缩短的完整URL地址',
        icon: 'EditPen',
        type: 'primary'
      },
      {
        title: '设置过期时间',
        content: '可选择设置短链接的过期时间，不设置将使用系统默认值',
        icon: 'Clock',
        type: 'success'
      },
      {
        title: '生成并使用',
        content: '点击生成按钮创建短链接，然后复制分享给他人使用',
        icon: 'Share',
        type: 'warning'
      }
    ]
    
    const disabledDate = (time) => {
      return time.getTime() < Date.now()
    }
    
    const handleSubmit = async () => {
      if (!formRef.value) return
      
      try {
        await formRef.value.validate()
        loading.value = true
        
        // 如果设置了过期时间，转换为时间戳
        if (expireDate.value) {
          form.expire_at = Math.floor(new Date(expireDate.value).getTime() / 1000)
        }
        
        const response = await userApi.createShortLink(form)
        
        if (response.code === 0) {
          result.value = response.data
          ElMessage.success('短链接生成成功！')
        } else {
          ElMessage.error(response.message || '生成失败')
        }
      } catch (error) {
        console.error('创建短链接失败:', error)
        ElMessage.error('生成失败，请重试')
      } finally {
        loading.value = false
      }
    }
    
    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text)
        ElMessage.success('已复制到剪贴板')
      } catch (error) {
        console.error('复制失败:', error)
        ElMessage.error('复制失败，请手动复制')
      }
    }
    
    const openShortLink = () => {
      if (result.value?.short_url) {
        window.open(result.value.short_url, '_blank')
      }
    }
    
    const resetForm = () => {
      result.value = null
      form.origin_url = ''
      form.expire_at = null
      expireDate.value = ''
      if (formRef.value) {
        formRef.value.resetFields()
      }
    }
    
    const formatExpireTime = (timestamp) => {
      if (!timestamp) return '永不过期'
      return new Date(timestamp * 1000).toLocaleString('zh-CN')
    }
    
    return {
      formRef,
      form,
      rules,
      loading,
      result,
      expireDate,
      instructions,
      disabledDate,
      handleSubmit,
      copyToClipboard,
      openShortLink,
      resetForm,
      formatExpireTime
    }
  }
}
</script>

<style scoped>
.user-panel {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.create-card,
.result-card,
.info-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
}

.card-header.success {
  color: #67c23a;
}

.card-header.info {
  color: #909399;
}

.header-icon {
  font-size: 20px;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item label {
  font-weight: 500;
  color: #606266;
}

.link-container {
  width: 100%;
}

.link-input {
  width: 100%;
}

.original-link,
.expire-time {
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  color: #606266;
  word-break: break-all;
}

.result-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.info-content {
  padding: 12px 0;
}

.info-content h4 {
  margin: 0 0 8px 0;
  color: #303133;
}

.info-content p {
  margin: 0;
  color: #606266;
  line-height: 1.5;
}

.admin-link-container {
  text-align: center;
  margin-top: 20px;
}

.admin-tip {
  color: #909399;
  font-size: 14px;
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .user-panel {
    padding: 0 12px;
  }
  
  .result-actions {
    flex-direction: column;
  }
  
  .result-actions .el-button {
    width: 100%;
  }
}
</style> 
