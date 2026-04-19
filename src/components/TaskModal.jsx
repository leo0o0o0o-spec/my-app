import { Modal, Form, Input, Select, DatePicker } from 'antd'


const { Option } = Select

function TaskModal({ open, onClose, onSubmit, initialValues }) {
  const [form] = Form.useForm()

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({
        ...values,
        dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : null,
      })
      form.resetFields()
    })
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title="新增任务"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="确认"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="title"
          label="任务名称"
          rules={[{ required: true, message: '请输入任务名称' }]}
        >
          <Input placeholder="请输入任务名称" />
        </Form.Item>
        <Form.Item name="priority" label="优先级" initialValue="medium">
          <Select>
            <Option value="high">高优先级</Option>
            <Option value="medium">中优先级</Option>
            <Option value="low">低优先级</Option>
          </Select>
        </Form.Item>
        <Form.Item name="dueDate" label="截止日期">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default TaskModal