import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001',
})

// 请求拦截器：可扩展加 token
api.interceptors.request.use((config) => {
  return config
})

// 响应拦截器：统一错误处理
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('请求错误:', error)
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