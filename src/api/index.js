import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001',
})

// 请求拦截器：自动带上 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：token 失效自动跳转登录
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const getColumns = () => api.get('/api/columns')

export const createTask = (columnId, task) =>
  api.post('/api/tasks', { ...task, columnId })

export const deleteTask = (taskId) =>
  api.delete(`/api/tasks/${taskId}`)

export const moveTask = (taskId, columnId) =>
  api.patch(`/api/tasks/${taskId}/move`, { columnId })

// 获取单个任务详情
export const getTask = async (id) => {
  const response = await api.get(`/api/tasks/${id}`)
  return response.data
}

// 更新任务
export const updateTask = async (id, data) => {
  const response = await api.put(`/api/tasks/${id}`, data)
  return response.data
}