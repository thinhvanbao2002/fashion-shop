/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Card, Col, Input, Row, Spin, Table } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { IColumnAntD } from 'common/constants/interface'
import { Styled } from 'styles/stylesComponent'
import { IInventoryItem, IPayloadListInventory } from '../Warehouse.props'
import { warehouseServices } from '../WarehouseApis'
import { getDataSource } from 'common/utils'
import dayjs from 'dayjs'
import { CloseOutlined } from '@ant-design/icons'

interface InventoryListProps {
  warehouseId: string
  onClose: () => void
}

interface IWarehouseProduct {
  id: number
  product_id: number
  quantity: number
  createdAt: string
  updatedAt: string
  product: {
    id: number
    name: string
    price: number
    description: string
    image: string
    category: {
      id: number
      name: string
    }
  }
}

export const InventoryList = ({ warehouseId, onClose }: InventoryListProps) => {
  const [inventory, setInventory] = useState<IWarehouseProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')

  const columns: IColumnAntD[] = [
    {
      title: 'STT',
      key: 'STT',
      dataIndex: 'STT',
      width: 20
    },
    {
      title: 'Mã sản phẩm',
      key: 'product_id',
      dataIndex: 'product_id'
    },
    {
      title: 'Tên sản phẩm',
      key: 'productName',
      dataIndex: 'product',
      render: (product: any) => product?.name
    },
    {
      title: 'Danh mục',
      key: 'category',
      dataIndex: 'product',
      render: (product: any) => product?.category?.name
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      dataIndex: 'quantity'
    },
    {
      title: 'Cập nhật lần cuối',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      render: (value: string) => dayjs(value).format('DD/MM/YYYY HH:mm')
    }
  ]

  const fetchInventory = useCallback(async (warehouseId: any) => {
    setLoading(true)
    try {
      const res = await warehouseServices.getById(warehouseId)
      console.log('🚀 ~ fetchInventory ~ res:', res)
      setInventory(getDataSource(res?.data?.warehouse_products || [], 1))
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInventory(warehouseId)
  }, [fetchInventory, warehouseId])

  const handleSearch = (value: string) => {
    setSearchText(value)
    const filteredData = inventory.filter((item) => item.product.name.toLowerCase().includes(value.toLowerCase()))
    setInventory(getDataSource(filteredData, 1))
  }

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-semibold'>Danh sách sản phẩm tồn kho</h2>
        <Button type='text' icon={<CloseOutlined />} onClick={onClose} className='hover:bg-gray-100' />
      </div>
      {/* <div className="mb-4">
        <Input.Search
          placeholder="Tìm kiếm theo tên sản phẩm"
          allowClear
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          value={searchText}
        />
      </div> */}
      <Spin spinning={loading}>
        <Styled.TableStyle
          bordered
          columns={columns}
          dataSource={inventory}
          pagination={{
            pageSize: 10
          }}
        />
      </Spin>
    </div>
  )
}
