import { useEffect, useState } from 'react'
import { Col, Row, Spin } from 'antd'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import BoardColumn from '../components/BoardColumn'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import { useBoardStore } from '../store/useBoardStore'
import { useFilterStore } from '../store/useFilterStore'

function BoardPage() {
  const { columns, loading, fetchColumns, moveTask } = useBoardStore()
  const { search, priority } = useFilterStore()
  const [activeTask, setActiveTask] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  useEffect(() => {
    fetchColumns()
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const findColumnByTaskId = (taskId) =>
    columns.find((col) => col.tasks.some((t) => t.id === taskId))

  const handleDragStart = ({ active }) => {
    const col = findColumnByTaskId(active.id)
    const task = col?.tasks.find((t) => t.id === active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null)
    if (!over) return
    const fromCol = findColumnByTaskId(active.id)
    if (!fromCol) return
    const toColDirect = columns.find((c) => c.id === over.id)
    if (toColDirect) {
      if (fromCol.id !== toColDirect.id) {
        moveTask(active.id, fromCol.id, toColDirect.id, null)
      }
      return
    }
    const toCol = findColumnByTaskId(over.id)
    if (!toCol) return
    moveTask(active.id, fromCol.id, toCol.id, over.id)
  }

  // 处理任务卡片点击
  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setModalOpen(true)
  }

  // 处理任务更新后的回调
  const handleTaskUpdate = (updatedTask) => {
    // 刷新看板数据
    fetchColumns()
  }

  // 筛选任务
  const filterTasks = (tasks) => {
    return tasks.filter((task) => {
      const matchSearch = task.title.toLowerCase().includes(search.toLowerCase())
      const matchPriority = priority === 'all' || task.priority === priority
      return matchSearch && matchPriority
    })
  }

  // 给每一列应用筛选
  const filteredColumns = columns.map((col) => ({
    ...col,
    tasks: filterTasks(col.tasks),
  }))

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
       <Row gutter={[16, 16]}>
  {filteredColumns.map((col) => (
    <Col key={col.id} xs={24} sm={24} md={8}>
      <BoardColumn 
        column={col} 
        onTaskClick={handleTaskClick}
      />
    </Col>
  ))}
</Row>
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
      
      <TaskModal
        open={modalOpen}
        task={selectedTask}
        onClose={() => setModalOpen(false)}
        onUpdate={handleTaskUpdate}
      />
    </>
  )
}

export default BoardPage