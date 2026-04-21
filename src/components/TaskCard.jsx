import { memo } from 'react'
import { Card, Tag, Typography } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'

const { Text } = Typography

const priorityConfig = {
  high: { color: 'red', label: '高优先级' },
  medium: { color: 'orange', label: '中优先级' },
  low: { color: 'green', label: '低优先级' },
}

// 判断是否临近截止（2天内）
const isDueSoon = (dueDate) => {
  if (!dueDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
  return diffDays >= 0 && diffDays <= 2
}

const TaskCard = memo(({ task, onClick }) => {
  const priority = priorityConfig[task.priority] || priorityConfig.medium
  const dueSoon = isDueSoon(task.due_date)

  return (
    <Card
      size="small"
      style={{ 
        marginBottom: 8, 
        cursor: 'pointer',
        border: dueSoon ? '2px solid #faad14' : '1px solid #f0f0f0',
        backgroundColor: dueSoon ? '#fffbe6' : 'white',
        transition: 'all 0.3s ease',
      }}
      hoverable
      onClick={onClick}
      bodyStyle={{ padding: 12 }}
    >
      <Text strong style={{ display: 'block', marginBottom: 8 }}>
        {task.title}
      </Text>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tag color={priority.color}>{priority.label}</Tag>
        {task.due_date && (
          <Text type={dueSoon ? 'warning' : 'secondary'} style={{ fontSize: 12 }}>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {task.due_date}
            {dueSoon && <span style={{ marginLeft: 4, color: '#faad14' }}>⚠️ 即将到期</span>}
          </Text>
        )}
      </div>
    </Card>
  )
})

export default TaskCard