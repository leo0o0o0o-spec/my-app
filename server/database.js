const Database = require('better-sqlite3')
const path = require('path')

const db = new Database(path.join(__dirname, 'kanban.db'))

// 初始化表结构
db.exec(`
  CREATE TABLE IF NOT EXISTS columns (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    position INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    due_date TEXT,
    column_id TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    FOREIGN KEY (column_id) REFERENCES columns(id)
  );
`)

// 插入初始列数据（如果没有的话）
const count = db.prepare('SELECT COUNT(*) as count FROM columns').get().count
if (count === 0) {
  const insert = db.prepare('INSERT INTO columns (id, title, position) VALUES (?, ?, ?)')
  insert.run('todo', '待处理', 0)
  insert.run('inProgress', '进行中', 1)
  insert.run('done', '已完成', 2)
}

module.exports = db