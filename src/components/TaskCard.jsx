import { Card, Tag, Typography } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'

const { Text } = Typography

const priorityConfig = {
  high: { color: 'red', label: '高优先级' },
  medium: { color: 'orange', label: '中优先级' },
  low: { color: 'green', label: '低优先级' },
}

function TaskCard({ task }) {
  const priority = priorityConfig[task.priority] || priorityConfig.medium

  return (
    <Card
      size="small"
      style={{ marginBottom: 8, cursor: 'grab' }}
      hoverable
    >
      <Text strong style={{ display: 'block', marginBottom: 8 }}>
        {task.title}
      </Text>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tag color={priority.color}>{priority.label}</Tag>
        {task.dueDate && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {task.dueDate}
          </Text>
        )}
      </div>
    </Card>
  )
}

export default TaskCard