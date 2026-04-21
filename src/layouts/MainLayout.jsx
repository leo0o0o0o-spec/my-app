import { Layout, Button, Space, Typography, Input, Select } from 'antd'
import { LogoutOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons'
import { Outlet, useNavigate } from 'react-router-dom'
import { useFilterStore } from '../store/useFilterStore'
import { useDebounce } from '../hooks/useDebounce'
import { useState, useEffect } from 'react'

const { Header, Content } = Layout
const { Text } = Typography

function MainLayout() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username')
  const { setSearch, setPriority } = useFilterStore()
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 300)

  // 防抖后更新搜索关键词
  useEffect(() => {
    setSearch(debouncedSearch)
  }, [debouncedSearch, setSearch])

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
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '20px', whiteSpace: 'nowrap' }}>
          任务看板
        </h1>
        <Space wrap>
          <Input
            prefix={<SearchOutlined style={{ color: 'white' }} />}
            placeholder="搜索任务"
            style={{ width: 200, background: 'rgba(255,255,255,0.1)', borderColor: 'transparent', color: 'white' }}
            onChange={(e) => setSearchInput(e.target.value)}
            allowClear
          />
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={(value) => setPriority(value)}
            options={[
              { value: 'all', label: '全部优先级' },
              { value: 'high', label: '高优先级' },
              { value: 'medium', label: '中优先级' },
              { value: 'low', label: '低优先级' },
            ]}
          />
        </Space>
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