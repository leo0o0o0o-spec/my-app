import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button, Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import TaskCard from './TaskCard'
import { useBoardStore } from '../store/useBoardStore'

function SortableTaskCard({ task, columnId }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const { deleteTask } = useBoardStore()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    position: 'relative',
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners}>
        <TaskCard task={task} />
      </div>
      <Popconfirm
        title="确认删除这个任务吗？"
        onConfirm={() => deleteTask(columnId, task.id)}
        okText="删除"
        cancelText="取消"
      >
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          size="small"
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        />
      </Popconfirm>
    </div>
  )
}

export default SortableTaskCard