import { create } from 'zustand'

const initialColumns = [
  {
    id: 'todo',
    title: '待处理',
    tasks: [
      { id: '1', title: '设计登录页面', priority: 'high', dueDate: '2026-04-25' },
      { id: '2', title: '编写接口文档', priority: 'medium', dueDate: '2026-04-28' },
    ],
  },
  {
    id: 'inProgress',
    title: '进行中',
    tasks: [
      { id: '3', title: '实现看板拖拽', priority: 'high', dueDate: '2026-04-20' },
    ],
  },
  {
    id: 'done',
    title: '已完成',
    tasks: [
      { id: '4', title: '项目初始化', priority: 'low', dueDate: '2026-04-18' },
    ],
  },
]

export const useBoardStore = create((set) => ({
  columns: initialColumns,

  // 移动任务（跨列或列内）
  moveTask: (taskId, fromColumnId, toColumnId, overTaskId) => {
    set((state) => {
      const columns = state.columns.map((col) => ({ ...col, tasks: [...col.tasks] }))
      const fromCol = columns.find((c) => c.id === fromColumnId)
      const toCol = columns.find((c) => c.id === toColumnId)
      const taskIndex = fromCol.tasks.findIndex((t) => t.id === taskId)
      const [task] = fromCol.tasks.splice(taskIndex, 1)

      if (overTaskId) {
        const overIndex = toCol.tasks.findIndex((t) => t.id === overTaskId)
        toCol.tasks.splice(overIndex, 0, task)
      } else {
        toCol.tasks.push(task)
      }

      return { columns }
    })
  },

  // 新增任务
  addTask: (columnId, task) => {
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: [...col.tasks, task] }
          : col
      ),
    }))
  },

  // 删除任务
  deleteTask: (columnId, taskId) => {
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
          : col
      ),
    }))
  },
}))