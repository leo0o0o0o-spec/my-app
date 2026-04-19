import { useState } from 'react'
import { Card, Button, Empty } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableTaskCard from './SortableTaskCard'
import TaskModal from './TaskModal'
import { useBoardStore } from '../store/useBoardStore'

function BoardColumn({ column }) {
  const { setNodeRef } = useDroppable({ id: column.id })
  const { addTask } = useBoardStore()
  const [modalOpen, setModalOpen] = useState(false)

  const handleAddTask = (values) => {
    const newTask = {
      id: Date.now().toString(),
      ...values,
    }
    addTask(column.id, newTask)
    setModalOpen(false)
  }

  return (
    <>
      <Card
        title={
          <span>
            {column.title}
            <span style={{
              marginLeft: 8,
              fontSize: 12,
              color: '#999',
              fontWeight: 'normal'
            }}>
              {column.tasks.length}
            </span>
          </span>
        }
        extra={
          <Button
            type="text"
            icon={<PlusOutlined />}
            size="small"
            onClick={() => setModalOpen(true)}
          />
        }
        style={{ marginBottom: 16 }}
        styles={{ body: { minHeight: 200 } }}
      >
        <SortableContext
          items={column.tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div ref={setNodeRef} style={{ minHeight: 100 }}>
            {column.tasks.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无任务"
              />
            ) : (
              column.tasks.map((task) => (
                <SortableTaskCard key={task.id} task={task} columnId={column.id} />
              ))
            )}
          </div>
        </SortableContext>
      </Card>
      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </>
  )
}

export default BoardColumn