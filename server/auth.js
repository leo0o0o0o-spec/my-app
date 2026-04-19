const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('./database')

const router = express.Router()
const JWT_SECRET = 'kanban_secret_2026'

// 注册
router.post('/register', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' })
  }
  const existing = db.get('users').find({ username }).value()
  if (existing) {
    return res.status(400).json({ message: '用户名已存在' })
  }
  const hashed = bcrypt.hashSync(password, 10)
  const id = Date.now().toString()
  db.get('users').push({ id, username, password: hashed }).write()
  res.json({ message: '注册成功' })
})

// 登录
router.post('/login', (req, res) => {
  const { username, password } = req.body
  const user = db.get('users').find({ username }).value()
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: '用户名或密码错误' })
  }
  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
  res.json({ token, username: user.username })
})

module.exports = router