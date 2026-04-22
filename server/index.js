require('dotenv').config()
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const db = require('./database')
const authRouter = require('./auth')

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'kanban_secret_2026'

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: '未登录' })
  }
  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: '未登录' })
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ message: 'token无效' })
  }
}

// 获取所有列和任务（按用户过滤）
app.get('/api/columns', authenticate, (req, res) => {
  const userId = req.user.id || req.user.username
  const columns = db.get('columns').sortBy('position').value()
  const result = columns.map((col) => ({
    ...col,
    tasks: db.get('tasks')
      .filter({ column_id: col.id, user_id: userId })
      .sortBy('position')
      .value(),
  }))
  res.json(result)
})

// 获取单个任务详情（检查所有权）
app.get('/api/tasks/:id', authenticate, (req, res) => {
  const userId = req.user.id || req.user.username
  const task = db.get('tasks').find({ id: req.params.id }).value()
  if (!task) return res.status(404).json({ message: '任务不存在' })
  if (task.user_id !== userId) {
    return res.status(403).json({ message: '无权访问' })
  }
  res.json(task)
})

// 新增任务（关联当前用户）
app.post('/api/tasks', authenticate, (req, res) => {
  const { title, description, priority, dueDate, columnId } = req.body
  const userId = req.user.id || req.user.username
  const id = Date.now().toString()
  const position = db.get('tasks')
    .filter({ column_id: columnId, user_id: userId })
    .value().length
  const newTask = { 
    id, 
    title, 
    description: description || '', 
    priority, 
    due_date: dueDate, 
    column_id: columnId, 
    user_id: userId,
    position 
  }
  db.get('tasks').push(newTask).write()
  res.json(newTask)
})

// 更新任务（检查所有权）
app.put('/api/tasks/:id', authenticate, (req, res) => {
  const userId = req.user.id || req.user.username
  const task = db.get('tasks').find({ id: req.params.id }).value()
  if (!task) return res.status(404).json({ message: '任务不存在' })
  if (task.user_id !== userId) {
    return res.status(403).json({ message: '无权修改' })
  }
  
  const { title, description, priority, dueDate } = req.body
  const updatedTask = {
    ...task,
    title: title !== undefined ? title : task.title,
    description: description !== undefined ? description : task.description,
    priority: priority !== undefined ? priority : task.priority,
    due_date: dueDate !== undefined ? dueDate : task.due_date,
  }
  db.get('tasks').find({ id: req.params.id }).assign(updatedTask).write()
  res.json(updatedTask)
})

// 删除任务（检查所有权）
app.delete('/api/tasks/:id', authenticate, (req, res) => {
  const userId = req.user.id || req.user.username
  const task = db.get('tasks').find({ id: req.params.id }).value()
  if (!task) return res.status(404).json({ message: '任务不存在' })
  if (task.user_id !== userId) {
    return res.status(403).json({ message: '无权删除' })
  }
  db.get('tasks').remove({ id: req.params.id }).write()
  res.json({ success: true })
})

// 移动任务（检查所有权）
app.patch('/api/tasks/:id/move', authenticate, (req, res) => {
  const userId = req.user.id || req.user.username
  const task = db.get('tasks').find({ id: req.params.id }).value()
  if (!task) return res.status(404).json({ message: '任务不存在' })
  if (task.user_id !== userId) {
    return res.status(403).json({ message: '无权移动' })
  }
  
  const { columnId } = req.body
  db.get('tasks').find({ id: req.params.id }).assign({ column_id: columnId }).write()
  res.json({ success: true })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})