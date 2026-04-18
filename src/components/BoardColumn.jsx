import { Card, Button, Empty } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import TaskCard from './TaskCard'

function BoardColumn({ column }) {
  return (
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
        />
      }
      style={{ marginBottom: 16 }}
      styles={{ body: { minHeight: 200 } }}
    >
      {column.tasks.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无任务"
        />
      ) : (
        column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))
      )}
    </Card>
  )
}

export default BoardColumn