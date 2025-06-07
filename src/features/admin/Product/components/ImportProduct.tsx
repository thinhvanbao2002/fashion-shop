import { Button, Form, InputNumber, Select, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { IWarehouse } from '../../Warehouse/Warehouse.props'
import { warehouseServices } from '../../Warehouse/WarehouseApis'
import { openNotification } from 'common/utils'

interface ImportStockModalProps {
  productId: string
  onSuccess: () => void
  onClose: () => void
}

interface ImportStockPayload {
  warehouse_id: string
  quantity: number
  product_id: string
}

export const ImportStockModal = ({ productId, onSuccess, onClose }: ImportStockModalProps) => {
  const [form] = Form.useForm()
  const [warehouses, setWarehouses] = useState<IWarehouse[]>([])
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    fetchWarehouses()
  }, [])

  const fetchWarehouses = async () => {
    try {
      setLoading(true)
      const res = await warehouseServices.get({
        page: 1,
        take: 100,
        name: searchValue || undefined
      })
      console.log('🚀 ~ fetchWarehouses ~ res:', res)
      if (res?.data) {
        setWarehouses(res.data)
      }
    } catch (error) {
      console.log('🚀 ~ fetchWarehouses ~ error:', error)
      openNotification('error', 'Lỗi', 'Không thể tải danh sách kho hàng')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
    fetchWarehouses()
  }

  const handleSubmit = async (values: { warehouseId: string; quantity: number }) => {
    try {
      setLoading(true)
      const payload: ImportStockPayload = {
        warehouse_id: values.warehouseId,
        quantity: values.quantity,
        product_id: productId
      }

      const res = await warehouseServices.importProduct(payload)
      console.log('🚀 ~ handleSubmit ~ res:', res)
      if (res?.status) {
        openNotification('success', 'Thành công', 'Nhập kho thành công')
        onSuccess()
        onClose()
      } else {
        openNotification('error', 'Lỗi', 'Nhập kho thất bại')
      }
    } catch (error) {
      console.log('🚀 ~ handleSubmit ~ error:', error)
      openNotification('error', 'Lỗi', 'Không thể nhập kho')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Spin spinning={loading}>
      <Form form={form} layout='vertical' onFinish={handleSubmit}>
        <Form.Item name='warehouseId' label='Chọn kho' rules={[{ required: true, message: 'Vui lòng chọn kho' }]}>
          <Select
            showSearch
            placeholder='Chọn kho'
            optionFilterProp='children'
            onSearch={handleSearch}
            filterOption={false}
            options={warehouses.map((warehouse) => ({
              label: `${warehouse.name} (${warehouse.code})`,
              value: warehouse.id
            }))}
          />
        </Form.Item>
        <Form.Item
          name='quantity'
          label='Số lượng'
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng' },
            { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0' }
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder='Nhập số lượng' />
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button onClick={onClose}>Hủy</Button>
          <Button type='primary' htmlType='submit' loading={loading}>
            Nhập kho
          </Button>
        </div>
      </Form>
    </Spin>
  )
}
