<template>
  <div class="admin-panel">
    <!-- 管理面板 -->
    <div class="admin-content">
      <!-- 数据表格 -->
      <el-card class="table-card" shadow="hover">
        <!-- 搜索过滤器 -->
        <div class="search-container">
          <div class="search-form-wrapper">
            <el-form :model="searchForm" class="search-form">
              <div class="search-inputs">
                <el-form-item label="原链接">
                  <el-input
                    v-model="searchForm.origin_url"
                    placeholder="请输入原链接"
                    clearable
                    size="large"
                    style="width: 280px"
                  />
                </el-form-item>
                <el-form-item label="短链接">
                  <el-input
                    v-model="searchForm.short_url"
                    placeholder="请输入短链接"
                    clearable
                    size="large"
                    style="width: 280px"
                  />
                </el-form-item>
              </div>
              <div class="search-buttons">
                <el-form-item>
                  <el-button type="primary" size="large" @click="handleSearch" style="width: 100%">
                    <el-icon><Search /></el-icon>
                    搜索
                  </el-button>
                </el-form-item>
                <el-form-item style="margin-top: 10px;">
                  <el-button size="large" @click="handleReset" style="width: 100%">
                    <el-icon><RefreshLeft /></el-icon>
                    重置
                  </el-button>
                </el-form-item>
              </div>
              <div class="action-buttons">
                <el-button type="primary" size="large" @click="showCreateDialog = true" style="width: 100%">
                  <el-icon><Plus /></el-icon>
                  新建短链接
                </el-button>
                <el-button type="danger" size="large" style="width: 100%; margin-top: 10px;">
                  <el-icon><Delete /></el-icon>
                  批量删除
                </el-button>
              </div>
            </el-form>
          </div>
        </div>

        <el-table
          :data="tableData"
          v-loading="tableLoading"
          stripe
          style="width: 100%"
          @sort-change="handleSortChange"
          ref="tableRef"
        >
          <el-table-column prop="id" label="ID" width="80" sortable="custom" />
          <el-table-column prop="origin_url" label="原链接" min-width="200" sortable="custom">
            <template #default="{ row }">
              <el-tooltip :content="row.origin_url" placement="top">
                <div class="url-cell">{{ row.origin_url }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="short_url" label="短链接" min-width="300" sortable="custom">
            <template #default="{ row }">
              <el-tooltip content="点击复制" placement="top">
                <div class="short-url-cell clickable" @click="copyToClipboard(row.short_url)">
                  <span>{{ row.short_url }}</span>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="expire_at" label="过期时间" width="200" sortable="custom">
            <template #default="{ row }">
              <el-tooltip :content="row.is_expired ? '已过期' : '未过期'" placement="top">
                <div :class="['expire-time', row.is_expired ? 'expired' : 'valid']">
                  {{ formatExpireTime(row.expire_at) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleEdit(row)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-popconfirm
                title="确定删除这个短链接吗？"
                @confirm="handleDelete(row.id)"
              >
                <template #reference>
                  <el-button type="danger" link>
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>

    <!-- 创建/编辑对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      :title="editingItem ? '编辑短链接' : '创建短链接'"
      width="500px"
      @close="resetCreateForm"
    >
      <el-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-width="100px"
      >
        <el-form-item 
          label="原链接" 
          :prop="editingItem ? '' : 'origin_url'"
        >
          <el-input
            v-model="createForm.origin_url"
            :readonly="!!editingItem"
            :placeholder="editingItem ? '' : '请输入原链接'"
            :class="{ 'readonly-input': !!editingItem }"
          />
        </el-form-item>
        <el-form-item label="短链接" prop="short_url">
          <el-input
            v-model="createForm.short_url"
            placeholder="留空自动生成"
          />
        </el-form-item>
        <el-form-item label="过期时间" prop="expire_at">
          <el-date-picker
            v-model="createExpireDate"
            type="datetime"
            placeholder="选择过期时间（可选）"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled-date="disabledDate"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateDialog = false">取消</el-button>
          <el-button type="primary" :loading="createLoading" @click="handleCreateSubmit">
            {{ editingItem ? '更新' : '创建' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { adminApi } from '../api'

export default {
  name: 'AdminPanel',
  setup() {
    const tableLoading = ref(false)
    const createLoading = ref(false)
    const showCreateDialog = ref(false)
    const editingItem = ref(null)
    const createExpireDate = ref('')
    
    const createFormRef = ref(null)
    const tableRef = ref(null)
    
    const searchForm = reactive({
      origin_url: '',
      short_url: '',
      sort: 'id',
      order: 'asc'
    })
    
    const createForm = reactive({
      origin_url: '',
      short_url: '',
      expire_at: null
    })
    
    const createRules = reactive({
      origin_url: [
        { required: true, message: '请输入原链接', trigger: 'blur' },
        {
          pattern: /^https?:\/\/.+/,
          message: '请输入有效的URL',
          trigger: 'blur'
        }
      ]
    })
    
    const tableData = ref([])
    const pagination = reactive({
      page: 1,
      pageSize: 10,
      total: 0
    })
    
    // 加载表格数据
    const loadTableData = async () => {
      tableLoading.value = true
      try {
        const params = {
          page: pagination.page,
          page_size: pagination.pageSize,
          ...searchForm
        }
        
        // 过滤空值
        Object.keys(params).forEach(key => {
          if (!params[key]) delete params[key]
        })
        
        const response = await adminApi.queryShortLinks(params)
        
        if (response.code === 0) {
          tableData.value = response.data.list
          pagination.total = response.data.total
        } else {
          ElMessage.error(response.message || '加载失败')
        }
      } catch (error) {
        console.error('加载数据失败:', error)
        ElMessage.error('加载失败，请重试')
      } finally {
        tableLoading.value = false
      }
    }
    
    // 搜索
    const handleSearch = () => {
      pagination.page = 1
      loadTableData()
    }
    
    // 重置搜索
    const handleReset = () => {
      searchForm.origin_url = ''
      searchForm.short_url = ''
      searchForm.sort = 'id'
      searchForm.order = 'asc'
      pagination.page = 1
      
      // 重置表格排序状态
      if (tableRef.value) {
        tableRef.value.clearSort()
      }
      
      loadTableData()
    }
    
    // 排序改变
    const handleSortChange = ({ prop, order }) => {
      if (prop && order) {
        searchForm.sort = prop
        searchForm.order = order === 'ascending' ? 'asc' : 'desc'
      } else {
        searchForm.sort = 'id'
        searchForm.order = 'asc'
      }
      pagination.page = 1
      loadTableData()
    }
    
    // 分页改变
    const handleSizeChange = (val) => {
      pagination.pageSize = val
      pagination.page = 1
      loadTableData()
    }
    
    const handleCurrentChange = (val) => {
      pagination.page = val
      loadTableData()
    }
    
    // 编辑
    const handleEdit = (row) => {
      editingItem.value = row
      createForm.origin_url = row.origin_url
      createForm.short_url = row.short_url
      createForm.expire_at = row.expire_at
      
      if (row.expire_at) {
        createExpireDate.value = new Date(row.expire_at * 1000).toISOString().slice(0, 19)
      }
      
      showCreateDialog.value = true
    }
    
    // 删除
    const handleDelete = async (id) => {
      try {
        const response = await adminApi.deleteShortLink(id)
        
        if (response.code === 0) {
          ElMessage.success('删除成功')
          loadTableData()
        } else {
          ElMessage.error(response.message || '删除失败')
        }
      } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败，请重试')
      }
    }
    
    // 创建/更新提交
    const handleCreateSubmit = async () => {
      if (!createFormRef.value) return
      
      try {
        await createFormRef.value.validate()
        createLoading.value = true
        
        // 转换过期时间
        if (createExpireDate.value) {
          createForm.expire_at = Math.floor(new Date(createExpireDate.value).getTime() / 1000)
        } else {
          createForm.expire_at = null
        }
        
        let response
        if (editingItem.value) {
          // 更新
          const updateData = {}
          if (createForm.short_url !== editingItem.value.short_url) {
            updateData.short_url = createForm.short_url
          }
          if (createForm.expire_at !== editingItem.value.expire_at) {
            updateData.expire_at = createForm.expire_at
          }
          
          response = await adminApi.updateShortLink(editingItem.value.id, updateData)
        } else {
          // 创建
          response = await adminApi.createShortLink(createForm)
        }
        
        if (response.code === 0) {
          ElMessage.success(editingItem.value ? '更新成功' : '创建成功')
          showCreateDialog.value = false
          resetCreateForm()
          loadTableData()
        } else {
          ElMessage.error(response.message || '操作失败')
        }
      } catch (error) {
        console.error('操作失败:', error)
        ElMessage.error('操作失败，请重试')
      } finally {
        createLoading.value = false
      }
    }
    
    // 重置创建表单
    const resetCreateForm = () => {
      editingItem.value = null
      createForm.origin_url = ''
      createForm.short_url = ''
      createForm.expire_at = null
      createExpireDate.value = ''
      if (createFormRef.value) {
        createFormRef.value.resetFields()
      }
    }
    
    // 复制到剪贴板
    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text)
        ElMessage.success('已复制到剪贴板')
      } catch (error) {
        console.error('复制失败:', error)
        ElMessage.error('复制失败，请手动复制')
      }
    }
    
    // 格式化过期时间
    const formatExpireTime = (timestamp) => {
      if (!timestamp) return '永不过期'
      
      const date = new Date(timestamp * 1000)
      
      // 格式化日期
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
    
    // 禁用过去的日期
    const disabledDate = (time) => {
      return time.getTime() < Date.now()
    }
    
    onMounted(() => {
      loadTableData()
    })
    
    return {
      tableLoading,
      createLoading,
      showCreateDialog,
      editingItem,
      createExpireDate,
      createFormRef,
      tableRef,
      searchForm,
      createForm,
      createRules,
      tableData,
      pagination,
      loadTableData,
      handleSearch,
      handleReset,
      handleSortChange,
      handleSizeChange,
      handleCurrentChange,
      handleEdit,
      handleDelete,
      handleCreateSubmit,
      resetCreateForm,
      copyToClipboard,
      formatExpireTime,
      disabledDate
    }
  }
}
</script>

<style scoped>
.admin-panel {
  max-width: 1200px;
  margin: 0 auto;
}

.admin-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.table-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
  padding: 16px 20px;
}

.search-container {
  margin-bottom: 20px;
  padding: 5px 0 20px;
  border-bottom: 1px solid #ebeef5;
}

.url-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.short-url-cell {
  display: flex;
  align-items: center;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.short-url-cell span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.short-url-cell.clickable {
  cursor: pointer;
  transition: color 0.2s;
}

.short-url-cell.clickable:hover {
  color: #409eff;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.readonly-input :deep(.el-input__wrapper) {
  background-color: #f5f7fa;
  color: #909399;
}

.expire-time-cell {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 6px 0;
}

.time-format {
  font-weight: 500;
  padding: 4px 0;
}

.expired-time {
  color: #f56c6c;
}

.valid-time {
  color: #67c23a;
}

.el-table {
  font-size: 15px;
  margin-top: 10px;
}

.el-table th {
  font-weight: bold;
  background-color: #f5f7fa;
}

.el-table td, .el-table th {
  padding: 14px 0;
}

.expire-time {
  font-family: 'Courier New', monospace;
  padding: 6px 2px;
  font-size: 15px;
  font-weight: 500;
}

.expired {
  color: #f56c6c;
}

.valid {
  color: #67c23a;
}

.search-form-wrapper {
  width: 100%;
}

.search-form {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.search-inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 120px;
  margin: 0 20px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 120px;
  margin-left: auto;
}

.search-form .el-button {
  width: 100%;
  min-width: unset;
}

.search-form .el-button + .el-button {
  margin-left: 0;
}

@media (max-width: 768px) {
  .admin-panel {
    padding: 0 12px;
  }
  
  .search-form {
    flex-direction: column;
  }
  
  .search-inputs, 
  .search-buttons,
  .action-buttons {
    width: 100%;
  }
}
</style> 

