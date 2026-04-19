const express = require('express')
const cors = require('cors')
const db = require('./database')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// 获取所有列和任务
app.get('/api/columns', (req, res) => {
  const columns = db.prepare('SELECT * FROM columns ORDER BY position').all()
  const result = columns.map((col) => {
    const tasks = db.prepare('SELECT * FROM tasks WHERE column_id = ? ORDER BY position').all(col.id)
    return { ...col, tasks }
  })
  res.json(result)
})

// 新增任务
app.post('/api/tasks', (req, res) => {
  const { title, priority, dueDate, columnId } = req.body
  const id = Date.now().toString()
  const position = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE column_id = ?').get(columnId).count
  db.prepare(
    'INSERT INTO tasks (id, title, priority, due_date, column_id, position) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, title, priority, dueDate, columnId, position)
  res.json({ id, title, priority, dueDate, columnId })
})

// 删除任务
app.delete('/api/tasks/:id', (req, res) => {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

// 移动任务（更新所属列）
app.patch('/api/tasks/:id/move', (req, res) => {
  const { columnId } = req.body
  db.prepare('UPDATE tasks SET column_id = ? WHERE id = ?').run(columnId, req.params.id)
  res.json({ success: true })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})