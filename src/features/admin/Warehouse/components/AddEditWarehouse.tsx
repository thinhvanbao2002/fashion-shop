import { Button, Form, Input } from 'antd'
import { IWarehouse } from '../Warehouse.props'

interface AddEditWarehouseProps {
  onFinish: (values: any) => void
  onClose: () => void
  rowSelected?: IWarehouse
}

export const AddEditWarehouse = ({ onFinish, onClose, rowSelected }: AddEditWarehouseProps) => {
  const [form] = Form.useForm()

  return (
    <Form form={form} layout='vertical' onFinish={onFinish} initialValues={rowSelected}>
      <Form.Item name='code' label='Mã kho hàng' rules={[{ required: true, message: 'Vui lòng nhập mã kho hàng' }]}>
        <Input placeholder='Nhập mã kho hàng' />
      </Form.Item>
      <Form.Item name='name' label='Tên kho hàng' rules={[{ required: true, message: 'Vui lòng nhập tên kho hàng' }]}>
        <Input placeholder='Nhập tên kho hàng' />
      </Form.Item>
      <Form.Item name='address' label='Địa chỉ' rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
        <Input.TextArea placeholder='Nhập địa chỉ' rows={3} />
      </Form.Item>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button type='primary' htmlType='submit'>
          {rowSelected ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </div>
    </Form>
  )
}
