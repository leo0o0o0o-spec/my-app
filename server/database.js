const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')

const adapter = new FileSync(path.join(__dirname, 'kanban.json'))
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

module.exports = db