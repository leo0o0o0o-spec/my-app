import { Modal, Form, Input, Select, DatePicker, message } from 'antd'
import { useEffect } from 'react'
import dayjs from 'dayjs'

const { TextArea } = Input

function TaskModal({ open, task, onClose, onSubmit, onUpdate }) {
  const [form] = Form.useForm()
  const isEdit = !!task // 如果有 task 参数，说明是编辑模式

  // 编辑模式：回填表单数据
  useEffect(() => {
    if (open) {
      if (isEdit && task) {
        form.setFieldsValue({
          title: task.title,
          description: task.description || '',
          priority: task.priority,
          dueDate: task.due_date ? dayjs(task.due_date) : null,
        })
      } else {
        // 新增模式：清空表单
        form.resetFields()
      }
    }
  }, [open, task, isEdit, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const formattedData = {
        title: values.title,
        description: values.description,
        priority: values.priority,
        dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : null,
      }

      if (isEdit) {
        // 编辑模式：调用更新接口
        const { updateTask } = await import('../api')
        const result = await updateTask(task.id, formattedData)
        message.success('更新成功')
        if (onUpdate) onUpdate(result)
      } else {
        // 新增模式：调用新增回调
        if (onSubmit) onSubmit(formattedData)
      }
      onClose()
    } catch (error) {
      console.error('表单验证失败:', error)
      message.error('请完善表单')
    }
  }

  return (
    <Modal
      title={isEdit ? "任务详情" : "新建任务"}
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText={isEdit ? "保存" : "创建"}
      cancelText="取消"
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="任务标题"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item name="description" label="详细描述">
          <TextArea rows={4} placeholder="请输入详细描述" />
        </Form.Item>
        <Form.Item
          name="priority"
          label="优先级"
          rules={[{ required: true, message: '请选择优先级' }]}
        >
          <Select>
            <Select.Option value="high">高优先级</Select.Option>
            <Select.Option value="medium">中优先级</Select.Option>
            <Select.Option value="low">低优先级</Select.Option>
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