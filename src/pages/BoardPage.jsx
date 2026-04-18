import { Col, Row } from 'antd'
import BoardColumn from '../components/BoardColumn'

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

function BoardPage() {
  return (
    <Row gutter={16}>
      {initialColumns.map((col) => (
        <Col key={col.id} xs={24} sm={8}>
          <BoardColumn column={col} />
        </Col>
      ))}
    </Row>
  )
}

export default BoardPage