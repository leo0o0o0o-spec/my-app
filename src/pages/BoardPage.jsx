import { useState } from 'react'
import { Col, Row } from 'antd'
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
import { useBoardStore } from '../store/useBoardStore'

function BoardPage() {
  const { columns, moveTask } = useBoardStore()
  const [activeTask, setActiveTask] = useState(null)

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

    // 拖到列上
    const toColDirect = columns.find((c) => c.id === over.id)
    if (toColDirect) {
      if (fromCol.id !== toColDirect.id) {
        moveTask(active.id, fromCol.id, toColDirect.id, null)
      }
      return
    }

    // 拖到任务上
    const toCol = findColumnByTaskId(over.id)
    if (!toCol) return
    moveTask(active.id, fromCol.id, toCol.id, over.id)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Row gutter={16}>
        {columns.map((col) => (
          <Col key={col.id} xs={24} sm={8}>
            <BoardColumn column={col} />
          </Col>
        ))}
      </Row>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

export default BoardPage