# 任务看板系统

> 一个功能完整的任务管理看板，支持拖拽排序、任务编辑、用户认证等功能。

## 在线地址

- **前端**：https://my-app-alpha-nine-70.vercel.app
- **后端 API**：https://kanban-api-ryhz.onrender.com

## 功能演示

![功能演示](./demo.gif)

## 技术栈

### 前端
- React 18 + Vite
- Zustand（状态管理）
- React Router v6（路由）
- Ant Design（UI 组件）
- @dnd-kit（拖拽功能）
- Axios（HTTP 请求）

### 后端
- Node.js + Express
- JWT（用户认证）
- lowdb（轻量数据库）

## 主要功能

-  用户注册/登录（JWT 鉴权）
-  三列看板（待处理/进行中/已完成）
-  任务拖拽排序（列内 + 跨列）
-  任务增删改查
-  任务详情弹窗（标题、描述、优先级、截止日期）
-  搜索任务 + 优先级筛选
-  截止日期临近提醒（2天内高亮）
-  多用户数据隔离（不同账号任务互不可见）
-  响应式布局（手机/平板/电脑）
-  性能优化（React.memo + 防抖）

## 本地运行

### 前端

```bash
git clone https://github.com/leo0o0o0o-spec/my-app.git
cd my-app
npm install
npm run dev
```

### 后端

```bash
cd server
npm install
npm run dev