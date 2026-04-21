import { create } from 'zustand'

export const useFilterStore = create((set) => ({
  search: '',
  priority: 'all',
  setSearch: (search) => set({ search }),
  setPriority: (priority) => set({ priority }),
  // 判断任务是否匹配筛选条件
  isTaskVisible: (task) => (state) => {
    const matchSearch = task.title.toLowerCase().includes(state.search.toLowerCase())
    const matchPriority = state.priority === 'all' || task.priority === state.priority
    return matchSearch && matchPriority
  },
}))