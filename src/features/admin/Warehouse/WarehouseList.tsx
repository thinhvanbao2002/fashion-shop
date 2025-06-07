/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react'
import { Table, Button, Input, DatePicker, Space, Card, Row, Col, Popconfirm, message } from 'antd'
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import warehouseApi, { Warehouse } from '../../../apis/warehouse'

interface WarehouseListProps {
  onOpenForm: (warehouse?: Warehouse) => void
}

const WarehouseList = ({ onOpenForm }: WarehouseListProps) => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    code: '',
    name: '',
    createdAt: null as dayjs.Dayjs | null
  })

  const fetchWarehouses = async () => {
    try {
      setLoading(true)
      const response = await warehouseApi.getAll({
        code: filters.code || undefined,
        name: filters.name || undefined,
        createdAt: filters.createdAt?.format('YYYY-MM-DD')
      })
      setWarehouses(response)
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải danh sách kho hàng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWarehouses()
  }, [filters])

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDelete = async (id: string) => {
    try {
      await warehouseApi.delete(id)
      message.success('Xóa kho hàng thành công')
      fetchWarehouses()
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa kho hàng')
    }
  }

  const handleViewInventory = (id: string) => {
    // TODO: Implement view inventory functionality
  }

  const columns: ColumnsType<Warehouse> = [
    {
      title: 'Mã kho hàng',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Tên kho hàng',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size='middle'>
          <Button type='text' icon={<EyeOutlined />} onClick={() => handleViewInventory(record.id)} />
          <Button type='text' icon={<EditOutlined />} onClick={() => onOpenForm(record)} />
          <Popconfirm
            title='Bạn có chắc chắn muốn xóa kho hàng này?'
            onConfirm={() => handleDelete(record.id)}
            okText='Có'
            cancelText='Không'
          >
            <Button type='text' danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Input
              placeholder='Mã kho hàng'
              value={filters.code}
              onChange={(e) => handleFilterChange('code', e.target.value)}
            />
          </Col>
          <Col span={8}>
            <Input
              placeholder='Tên kho hàng'
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />
          </Col>
          <Col span={8}>
            <DatePicker
              style={{ width: '100%' }}
              placeholder='Ngày tạo'
              value={filters.createdAt}
              onChange={(date) => handleFilterChange('createdAt', date)}
              format='DD/MM/YYYY'
            />
          </Col>
        </Row>
      </Card>

      <div style={{ marginBottom: 16 }}>
        <Button type='primary' onClick={() => onOpenForm()}>
          Thêm kho hàng mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={warehouses}
        rowKey='id'
        loading={loading}
        pagination={{
          total: warehouses.length,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} kho hàng`
        }}
      />
    </div>
  )
}

export default WarehouseList
