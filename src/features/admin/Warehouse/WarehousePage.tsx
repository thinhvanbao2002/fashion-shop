import { Button, Row, Spin } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { IColumnAntD } from 'common/constants/interface'
import { TooltipCustom } from 'common/components/tooltip/ToolTipComponent'
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { ShowConfirm } from 'common/components/Alert'
import { Styled } from 'styles/stylesComponent'
import ModalComponent from 'common/components/modal/Modal'
import { getDataSource, openNotification } from 'common/utils'
import { FilterWarehouse } from './components/FilterWarehouse'
import { IPayloadListWarehouse, IWarehouse, IWarehousePayload } from './Warehouse.props'
import { warehouseServices } from './WarehouseApis'
import { AddEditWarehouse } from './components/AddEditWarehouse'
import { InventoryList } from './components/InventoryList'

function WarehousePage() {
  const [payload, setPayload] = useState<IPayloadListWarehouse>({
    page: 1,
    take: 10,
    code: '',
    name: '',
    createdAt: ''
  })
  const [warehouses, setWarehouses] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [count, setCount] = useState<number>(0)
  const [rowSelected, setRowSelected] = useState<IWarehouse>()
  const [inventoryModalVisible, setInventoryModalVisible] = useState<boolean>(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState<IWarehouse | null>(null)

  const columnsListWarehouse: IColumnAntD[] = [
    {
      title: 'STT',
      key: 'STT',
      dataIndex: 'STT',
      width: 20
    },
    {
      title: 'Mã kho',
      key: 'code',
      dataIndex: 'code'
    },
    {
      title: 'Tên kho',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'Địa chỉ',
      key: 'address',
      dataIndex: 'address'
    },
    {
      title: 'Ngày tạo',
      key: 'createdAt',
      dataIndex: 'createdAt'
    },
    {
      width: 80,
      title: 'Thao tác',
      key: 'tt',
      dataIndex: 'tt',
      render: (value: number, record: any) => {
        return (
          <div style={{ display: 'flex' }}>
            <TooltipCustom
              title={'Xem tồn kho'}
              children={
                <Button
                  type={'text'}
                  className={'btn-success-text'}
                  icon={<EyeOutlined />}
                  onClick={() => handleViewInventory(record)}
                />
              }
            />
            <TooltipCustom
              title={'Cập nhật'}
              children={
                <Button
                  type={'text'}
                  className={'btn-success-text'}
                  icon={<EditOutlined />}
                  onClick={() => handleEditWarehouse(record)}
                />
              }
            />
            <ShowConfirm
              placement='bottomLeft'
              onConfirm={() => handleRemoveWarehouse(record)}
              confirmText={'Xóa'}
              title={'Bạn có chắc chắn muốn xóa?'}
            >
              <TooltipCustom
                title='Xóa'
                children={<Button type='text' className={'btn-delete-text'} icon={<DeleteOutlined />} />}
              />
            </ShowConfirm>
          </div>
        )
      }
    }
  ]

  const handleGetWarehouses = async (payload?: any) => {
    try {
      const res = await warehouseServices.get(payload)
      console.log('🚀 ~ handleGetWarehouses ~ res:', res)
      setWarehouses(getDataSource(res?.data, 1))
      setCount(res?.meta?.item_count)
    } catch (error) {
      console.log('🚀 ~ handleGetWarehouses ~ error:', error)
    }
  }

  useEffect(() => {
    handleGetWarehouses(payload)
  }, [payload])

  const handleFilter = useCallback(
    (value: any) => {
      if (value?.code) {
        setPayload({
          ...payload,
          code: value.code,
          page: 1
        })
      }
      if (value?.name) {
        setPayload({
          ...payload,
          name: value.name,
          page: 1
        })
      }
      if (value?.createdAt) {
        setPayload({
          ...payload,
          createdAt: value.createdAt
        })
      }
    },
    [payload]
  )

  const handleSubmit = async (value: any) => {
    setIsLoading(true)
    const payloadWarehouse: IWarehousePayload = {
      code: value?.code,
      name: value?.name,
      address: value?.address
    }

    if (rowSelected?.id) {
      payloadWarehouse.id = rowSelected.id
    }
    let res
    try {
      if (rowSelected?.id) {
        res = await warehouseServices.patch(payloadWarehouse)
      } else {
        res = await warehouseServices.post(payloadWarehouse)
      }

      if (res) {
        if (rowSelected) {
          openNotification('success', 'Thành công', 'Cập nhật kho hàng thành công')
        } else {
          openNotification('success', 'Thành công', 'Thêm mới kho hàng thành công')
        }
        setModalVisible(false)
        handleGetWarehouses()
      }
    } catch (error) {
      console.log('🚀 ~ handleSubmit ~ error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditWarehouse = useCallback(async (record: any) => {
    setModalVisible(true)
    setTitle('Cập nhật kho hàng')
    setRowSelected(record)
  }, [])

  const handleViewInventory = useCallback(async (record: any) => {
    setSelectedWarehouse(record)
    setInventoryModalVisible(true)
  }, [])

  const handleRemoveWarehouse = useCallback(async (record: any) => {
    try {
      const res = await warehouseServices.delete(record?.id)
      if (res) {
        openNotification('success', 'Thành công', 'Xóa kho hàng thành công')
        setIsLoading(true)
        handleGetWarehouses()
        setIsLoading(false)
      }
    } catch (error) {
      console.log('🚀 ~ handleRemoveWarehouse ~ error:', error)
    }
  }, [])

  const handleClose = useCallback(() => {
    setModalVisible(false)
    setRowSelected(undefined)
  }, [])

  const handleCloseInventory = useCallback(() => {
    setInventoryModalVisible(false)
    setSelectedWarehouse(null)
  }, [])

  return (
    <>
      <Row gutter={[15, 6]} className='mb-2'>
        <FilterWarehouse onChangeValue={handleFilter} />
      </Row>
      <Row className='mb-2 flex justify-end'>
        <Button
          type='primary'
          onClick={() => {
            setModalVisible(true)
            setTitle('Thêm mới kho hàng')
          }}
        >
          Thêm mới
        </Button>
        <Button className='ml-2' type='primary'>
          Xuất Excel
        </Button>
      </Row>
      <Spin spinning={isLoading}>
        <Styled.TableStyle
          bordered
          columns={columnsListWarehouse}
          dataSource={warehouses}
          pagination={{
            onChange: (page) => {
              setIsLoading(true)
              setTimeout(() => {
                setPayload({ ...payload, page: page })
                setIsLoading(false)
              }, 200)
            },
            total: count,
            current: payload.page,
            pageSize: payload.take
          }}
        />
      </Spin>
      <ModalComponent
        loading={isLoading}
        title={title}
        width={500}
        modalVisible={modalVisible}
        children={<AddEditWarehouse onFinish={handleSubmit} onClose={handleClose} rowSelected={rowSelected} />}
      />
      <ModalComponent
        loading={isLoading}
        width={800}
        modalVisible={inventoryModalVisible}
        children={
          selectedWarehouse && <InventoryList warehouseId={selectedWarehouse.id} onClose={handleCloseInventory} />
        }
      />
    </>
  )
}

export default WarehousePage
