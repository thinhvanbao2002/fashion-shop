/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react'
import { Modal, Form, Input, Button, message, Row, Col } from 'antd'
import warehouseApi, { Warehouse, CreateWarehouseDto } from '../../../apis/warehouse'

interface WarehouseFormProps {
  open: boolean
  onClose: () => void
  warehouse?: Warehouse
}

const WarehouseForm = ({ open, onClose, warehouse }: WarehouseFormProps) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (warehouse) {
      form.setFieldsValue({
        code: warehouse.code,
        name: warehouse.name,
        address: warehouse.address
      })
    } else {
      form.resetFields()
    }
  }, [warehouse, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      if (warehouse) {
        await warehouseApi.update(warehouse.id, values)
        message.success('Cập nhật kho hàng thành công')
      } else {
        await warehouseApi.create(values as CreateWarehouseDto)
        message.success('Thêm kho hàng mới thành công')
      }
      onClose()
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu kho hàng')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={warehouse ? 'Cập nhật kho hàng' : 'Thêm kho hàng mới'}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key='cancel' onClick={onClose}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' onClick={handleSubmit} loading={loading}>
          {warehouse ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      ]}
      width={800}
    >
      <Form form={form} layout='vertical' style={{ marginTop: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='code'
              label='Mã kho hàng'
              rules={[{ required: true, message: 'Vui lòng nhập mã kho hàng' }]}
            >
              <Input placeholder='Nhập mã kho hàng' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='name'
              label='Tên kho hàng'
              rules={[{ required: true, message: 'Vui lòng nhập tên kho hàng' }]}
            >
              <Input placeholder='Nhập tên kho hàng' />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name='address' label='Địa chỉ' rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
          <Input.TextArea placeholder='Nhập địa chỉ' rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default WarehouseForm
