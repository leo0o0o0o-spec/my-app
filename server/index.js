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
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: '未登录' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'token无效' })
  }
}

// 获取所有列和任务
app.get('/api/columns', authenticate, (req, res) => {
  const columns = db.get('columns').sortBy('position').value()
  const result = columns.map((col) => ({
    ...col,
    tasks: db.get('tasks').filter({ column_id: col.id }).sortBy('position').value(),
  }))
  res.json(result)
})

// 获取单个任务详情
app.get('/api/tasks/:id', authenticate, (req, res) => {
  const task = db.get('tasks').find({ id: req.params.id }).value()
  if (!task) return res.status(404).json({ message: '任务不存在' })
  res.json(task)
})

// 新增任务
app.post('/api/tasks', authenticate, (req, res) => {
  const { title, description, priority, dueDate, columnId } = req.body
  const id = Date.now().toString()
  const position = db.get('tasks').filter({ column_id: columnId }).value().length
  const newTask = { 
    id, 
    title, 
    description: description || '', 
    priority, 
    due_date: dueDate, 
    column_id: columnId, 
    position 
  }
  db.get('tasks').push(newTask).write()
  res.json(newTask)
})

// 更新任务
app.put('/api/tasks/:id', authenticate, (req, res) => {
  const { title, description, priority, dueDate } = req.body
  const task = db.get('tasks').find({ id: req.params.id }).value()
  if (!task) return res.status(404).json({ message: '任务不存在' })
  
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

// 删除任务
app.delete('/api/tasks/:id', authenticate, (req, res) => {
  db.get('tasks').remove({ id: req.params.id }).write()
  res.json({ success: true })
})

// 移动任务
app.patch('/api/tasks/:id/move', authenticate, (req, res) => {
  const { columnId } = req.body
  db.get('tasks').find({ id: req.params.id }).assign({ column_id: columnId }).write()
  res.json({ success: true })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})