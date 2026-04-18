import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'

const { Header, Content } = Layout

function MainLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center',
        background: '#001529'
      }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '20px' }}>
          任务看板
        </h1>
      </Header>
      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <Outlet />
      </Content>
    </Layout>
  )
}

export default MainLayout