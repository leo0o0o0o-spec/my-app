const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')

// 生产环境使用 /tmp 目录（Render 临时存储）
const isProduction = process.env.NODE_ENV === 'production'
const dbPath = isProduction 
  ? path.join('/tmp', 'kanban.json')
  : path.join(__dirname, 'kanban.json')

const adapter = new FileSync(dbPath)
const db = low(adapter)

// 初始化默认数据
db.defaults({
  columns: [
    { id: 'todo', title: '待处理', position: 0 },
    { id: 'inProgress', title: '进行中', position: 1 },
    { id: 'done', title: '已完成', position: 2 },
  ],
  tasks: [],
  users: [],
}).write()

console.log(`数据库路径: ${dbPath}`)

module.exports = db