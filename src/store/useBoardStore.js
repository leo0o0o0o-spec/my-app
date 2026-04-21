import { create } from 'zustand'
import { getColumns, createTask, deleteTask, moveTask } from '../api'

export const useBoardStore = create((set) => ({
  columns: [],
  loading: false,

  // 从后端加载数据
  fetchColumns: async () => {
    set({ loading: true })
    try {
      const columns = await getColumns()
      set({ columns, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  // 新增任务
  addTask: async (columnId, task) => {
    const newTask = await createTask(columnId, task)
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      ),
    }))
  },

  // 删除任务
  deleteTask: async (columnId, taskId) => {
    await deleteTask(taskId)
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
          : col
      ),
    }))
  },

  // 移动任务
 moveTask: async (taskId, fromColumnId, toColumnId, overTaskId) => {
  if (fromColumnId === toColumnId) return
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
  await moveTask(taskId, toColumnId)
},
}))