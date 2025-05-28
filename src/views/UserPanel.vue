<template>
  <div class="user-panel">
    <div class="main-container">
      <h1 class="main-title">轻松缩短链接</h1>
      
      <div class="input-container">
        <el-input
          v-model="form.origin_url"
          placeholder="输入链接"
          class="url-input"
        />
        <el-button
          type="primary"
          :loading="loading"
          @click="handleSubmit"
          class="submit-button"
        >
          缩短
        </el-button>
      </div>
      
      <div class="options-link">
        <el-link type="primary" @click="showAdvanced = !showAdvanced" class="advanced-toggle">
          <el-icon><Setting /></el-icon>
          其他选择
        </el-link>
      </div>
      
      <div v-if="showAdvanced" class="advanced-options">
        <el-form ref="formRef" :model="form" :rules="rules">
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
          </el-form-item>
        </el-form>
      </div>

      <!-- 结果展示 -->
      <transition name="fade">
        <div v-if="result" class="result-section">
          <div class="result-content">
            <div class="result-row">
              <div class="result-item">
                <label>原链接</label>
                <div class="info-value original-link" :title="result.origin_url">{{ result.origin_url }}</div>
              </div>
              
              <div class="result-item short-link-item">
                <label>短链接</label>
                <div class="info-value">
                  <div class="short-url" @click="copyToClipboard(result.short_url)">{{ result.short_url }}</div>
                </div>
              </div>
              
              <div class="result-item">
                <label>过期时间</label>
                <div class="info-value expire-time">{{ formatExpireTime(result.expire_at) }}</div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { userApi } from '../api'

export default {
  name: 'UserPanel',
  setup() {
    const formRef = ref(null)
    const loading = ref(false)
    const result = ref(null)
    const expireDate = ref('')
    const showAdvanced = ref(false)
    
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
    
    const disabledDate = (time) => {
      return time.getTime() < Date.now()
    }
    
    const handleSubmit = async () => {
      if (!form.origin_url) {
        ElMessage.warning('请输入需要缩短的链接')
        return
      }
      
      if (!form.origin_url.match(/^https?:\/\/.+/)) {
        ElMessage.warning('请输入有效的URL，需要包含http://或https://')
        return
      }
      
      try {
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
      showAdvanced,
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.main-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 10%;
  box-sizing: border-box;
}

.main-title {
  font-size: 56px;
  font-weight: 600;
  color: #333;
  margin: 0 0 30px;
}

.input-container {
  display: flex;
  width: 45vw;
  margin: 0 auto;
  justify-content: center;
  gap: 15px;
}

.url-input {
  flex: 1;
}

.url-input :deep(.el-input__wrapper) {
  border-radius: 4px;
  height: 50px;
}

.url-input :deep(.el-input__inner) {
  font-size: 16px;
  padding-left: 20px;
  height: 100%;
  line-height: 50px;
}

.submit-button {
  width: 80px;
  height: 50px;
  border-radius: 4px;
  background-color: #ff7d7d;
  border-color: #ff7d7d;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
}

.submit-button:hover {
  background-color: #ff6565;
  border-color: #ff6565;
}

.options-link {
  margin-top: 10px;
  text-align: left;
  width: 45vw;
  margin-left: auto;
  margin-right: auto;
}

.advanced-toggle {
  font-size: 14px;
  color: #2591ae;
}

.advanced-options {
  width: 45vw;
  margin: 15px auto;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 4px;
  text-align: left;
}

.result-section {
  width: 45vw;
  margin: 30px auto 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.result-section:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.result-content {
  padding: 24px;
}

.result-row {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: space-between;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-width: calc(33% - 20px);
  position: relative;
}

.short-link-item {
  z-index: 1;
}

.result-item::after {
  content: '';
  position: absolute;
  width: 1px;
  height: 70%;
  background: rgba(0, 0, 0, 0.06);
  right: -15px;
  top: 15%;
}

.result-item:last-child::after {
  display: none;
}

.result-item label {
  font-weight: 600;
  color: #909399;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  transition: all 0.2s;
}

.short-url {
  font-size: 14px;
  color: #2591ae;
  word-break: break-all;
  line-height: 1.5;
  cursor: pointer;
  transition: color 0.2s;
}

.short-url:hover {
  color: #1a6d83;
  text-decoration: underline;
}

.original-link,
.expire-time {
  color: #303133;
  padding: 4px 0;
}

.form-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s, transform 0.4s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .main-title {
    font-size: 28px;
    margin: 40px 0 30px;
  }
  
  .input-container {
    flex-direction: column;
    width: 90vw;
    gap: 10px;
  }
  
  .url-input :deep(.el-input__wrapper) {
    border-radius: 4px;
    height: 55px;
  }
  
  .url-input :deep(.el-input__inner) {
    line-height: 55px;
  }
  
  .submit-button {
    width: 100%;
    border-radius: 4px;
    height: 50px;
  }

  .options-link,
  .advanced-options,
  .result-section {
    width: 90vw;
  }
  
  .result-section {
    width: 90vw;
    border-radius: 10px;
  }
  
  .result-row {
    flex-direction: column;
    gap: 24px;
  }

  .result-item {
    width: 100%;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
  
  .result-item:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
  
  .result-item::after {
    display: none;
  }
  
  .info-value {
    white-space: normal;
    word-break: break-all;
  }
}
</style> 
