import axios from 'axios'

// 创建axios实例
const api = axios.create({
    baseURL: 'https://api.server.test/v1',
    timeout: 10000
})

// 请求拦截器
api.interceptors.request.use(
    config => {
        // 如果有token，添加到请求头
        const token = localStorage.getItem('admin_token')
        if (token && config.url.includes('/admin/')) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
api.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        console.error('API请求错误:', error)
        return Promise.reject(error)
    }
)

// Mock数据生成器
const generateMockShortLink = (id) => {
    const rand = Math.random()
    let randomExpire, is_expired

    if (rand < 0.7) {
        // 70% 已过期
        randomExpire = Math.floor(Date.now() / 1000) - 86400 * Math.floor(Math.random() * 10 + 1) // 1-10天前过期
        is_expired = true
    } else {
        // 30% 未过期
        randomExpire = Math.floor(Date.now() / 1000) + 86400 * Math.floor(Math.random() * 30 + 1) // 1-30天后过期
        is_expired = false
    }

    return {
        id: id || Math.floor(Math.random() * 1000) + 1,
        origin_url: `https://www.example${id || Math.floor(Math.random() * 100)}.com`,
        short_url: `https://www.s.example.com/${Math.random().toString(36).substr(2, 6)}`,
        expire_at: randomExpire,
        is_expired: is_expired
    }
}

// 用户端API
export const userApi = {
    // 创建短链接
    createShortLink: async (data) => {
        // Mock响应
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    code: 0,
                    message: '创建成功',
                    data: generateMockShortLink()
                })
            }, 500)
        })

        // 实际API调用（注释掉的代码）
        // return api.post('/quank-links', data)
    }
}

// 管理员API
export const adminApi = {
    // 查询短链接
    queryShortLinks: async (params) => {
        // Mock响应
        return new Promise((resolve) => {
            setTimeout(() => {
                const total = 50
                let list = Array.from({ length: Math.min(params.page_size || 10, 20) }, (_, i) =>
                    generateMockShortLink(i + 1 + ((params.page || 1) - 1) * (params.page_size || 10))
                )

                // 模拟排序
                if (params.sort && params.order) {
                    list.sort((a, b) => {
                        let aVal = a[params.sort]
                        let bVal = b[params.sort]

                        // 处理不同类型的排序
                        if (typeof aVal === 'string') {
                            aVal = aVal.toLowerCase()
                            bVal = bVal.toLowerCase()
                        }

                        if (params.order === 'asc') {
                            return aVal > bVal ? 1 : -1
                        } else {
                            return aVal < bVal ? 1 : -1
                        }
                    })
                }

                resolve({
                    code: 0,
                    message: '查询成功',
                    data: {
                        total,
                        list
                    }
                })
            }, 300)
        })

        // 实际API调用（注释掉的代码）
        // return api.get('/admin/quank-links', { params })
    },

    // 创建短链接
    createShortLink: async (data) => {
        // Mock响应
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    code: 0,
                    message: '创建成功',
                    data: {
                        ...generateMockShortLink(),
                        short_url: data.short_url || generateMockShortLink().short_url
                    }
                })
            }, 500)
        })

        // 实际API调用（注释掉的代码）
        // return api.post('/admin/quank-links', data)
    },

    // 更新短链接
    updateShortLink: async (id, data) => {
        // Mock响应
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    code: 0,
                    message: '更新成功',
                    data: {
                        ...generateMockShortLink(id),
                        ...data
                    }
                })
            }, 500)
        })

        // 实际API调用（注释掉的代码）
        // return api.patch(`/admin/quank-links/${id}`, data)
    },

    // 删除短链接
    deleteShortLink: async (id) => {
        // Mock响应
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    code: 0,
                    message: '删除成功',
                    data: { id }
                })
            }, 500)
        })

        // 实际API调用（注释掉的代码）
        // return api.delete(`/admin/quank-links/${id}`)
    }
}

export default api 
