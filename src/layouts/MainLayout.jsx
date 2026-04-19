import { Layout, Button, Space, Typography } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Outlet, useNavigate } from 'react-router-dom'

const { Header, Content } = Layout
const { Text } = Typography

function MainLayout() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#001529',
        padding: '0 24px',
      }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '20px' }}>
          任务看板
        </h1>
        <Space>
          <UserOutlined style={{ color: 'white' }} />
          <Text style={{ color: 'white' }}>{username}</Text>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            style={{ color: 'white' }}
            onClick={handleLogout}
          >
            退出
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <Outlet />
      </Content>
    </Layout>
  )
}

export default MainLayout