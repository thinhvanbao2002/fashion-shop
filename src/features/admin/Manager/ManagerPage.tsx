/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Row } from 'antd'
import { Styled } from 'styles/stylesComponent'
import { useCallback, useEffect, useState } from 'react'
import FilterAccount from './components/FilterAccount'
import { IAccount, IColumnAntD, IPayLoadListUser } from './Manager.props'
import { accountServices } from './ManagerApis'
import { getDataSource, openNotification } from 'common/utils'
import ModalComponent from 'common/components/modal/Modal'
import { AddEditManager } from './components/AddEditAccount'
import { TooltipCustom } from 'common/components/tooltip/ToolTipComponent'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ShowConfirm } from 'common/components/Alert'

function ManagerPage() {
  const [page, setPage] = useState<number>(1)
  const [payload, setPayload] = useState<IPayLoadListUser>({
    page: 1,
    limit: 10,
    q: '',
    status: '',
    to_date: '',
    from_date: ''
  })
  const [accounts, setAccount] = useState<any>([])
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [textButton, setTextButton] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [rowSelected, setRowSelected] = useState<IAccount>()

  const columnsListAccount: IColumnAntD[] = [
    {
      title: 'STT',
      key: 'STT',
      dataIndex: 'STT',
      width: 20
    },
    {
      title: 'Họ và tên',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email'
    },
    {
      title: 'Số điện thoại',
      key: 'phone',
      dataIndex: 'phone'
    },
    {
      title: 'Trạng thái',
      key: 'textStatus',
      dataIndex: 'textStatus'
    },
    {
      width: 80,
      title: 'Thao tác',
      key: 'tt',
      dataIndex: 'tt',
      render: (value: number, record) => {
        return (
          <div style={{ display: 'flex' }}>
            <TooltipCustom
              title={'Cập nhật'}
              children={
                <Button
                  type={'text'}
                  className={'btn-success-text'}
                  icon={<EditOutlined />}
                  onClick={() => handleEditAccount(record)}
                />
              }
            />
            <ShowConfirm
              placement='bottomLeft'
              onConfirm={() => handleRemoveAccount(record)}
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

  const handleGetAccount = async (payload?: IPayLoadListUser) => {
    try {
      const res = await accountServices.get(payload)
      setAccount(getDataSource(res?.data, 1))
    } catch (error) {
      console.log('🚀 ~ handleGetAccount ~ error:', error)
    }
  }

  useEffect(() => {
    handleGetAccount(payload)
  }, [payload])

  const handleFilter = useCallback(
    (value: any) => {
      if (value?.status) {
        setPayload({
          ...payload,
          status: value.status,
          page: 1
        })
      }
      if (value?.date) {
        setPayload({
          ...payload,
          from_date: value?.date.split(',')[0],
          to_date: value?.date.split(',')[1]
        })
      }
      if (value?.search) {
        setPayload({
          ...payload,
          q: value?.search
        })
      }
    },
    [payload]
  )

  const handleSetModalVisible = useCallback(() => {
    setModalVisible(false)
    setRowSelected(undefined)
  }, [])

  const handleSubmit = async (value: any) => {
    console.log('🚀 ~ handleSubmit ~ value:', value)
    setIsLoading(true)
    const payLoadAccount = {
      id: rowSelected?.id,
      name: value?.name,
      phone: value?.phone,
      email: value?.email,
      status: value?.status
    }
    let res
    try {
      if (rowSelected?.id) {
        res = await accountServices.put(payLoadAccount)
      } else {
        res = await accountServices.post({ ...payLoadAccount, password: value?.password })
      }
      console.log('🚀 ~ handleSubmit ~ res:', res)

      if (res.status == 1) {
        if (rowSelected) {
          console.log('1')

          openNotification('success', 'Thành công', 'Cập nhật thành công')
        } else {
          console.log('2')

          openNotification('success', 'Thành công', 'Thêm mới thành công')
        }
        setIsLoading(false)
        setModalVisible(false)
        handleGetAccount()
      }
    } catch (error) {
      console.log('🚀 ~ handleSubmit ~ error:', error)
    }
  }

  const handleEditAccount = useCallback(async (record: IAccount) => {
    setModalVisible(true)
    setRowSelected(record)
  }, [])

  const handleRemoveAccount = useCallback(
    async (value) => {
      try {
        const res = await accountServices.delete(value?.id)
        if (res) {
          openNotification('success', 'Thành công', 'Thêm mới thành công')
          handleGetAccount()
        }
      } catch (error) {
        console.log('🚀 ~ error:', error)
      }
    },
    [payload]
  )

  return (
    <>
      <Row gutter={[15, 6]} className='mb-2'>
        <FilterAccount onChangeValue={handleFilter} />
      </Row>
      <Row className='mb-2 flex justify-end'>
        <Button
          type='primary'
          onClick={() => {
            setModalVisible(true)
            setTitle('Thêm mới quản trị viên')
            setTextButton('Thêm mới')
          }}
        >
          Thêm mới
        </Button>
        <Button className='ml-2' type='primary'>
          Xuất Excel
        </Button>
      </Row>
      <Styled.TableStyle
        bordered
        columns={columnsListAccount}
        dataSource={accounts}
        pagination={{
          onChange: (page) => setPayload({ ...payload, page: page }),
          total: 100,
          current: payload.page
        }}
      />
      <ModalComponent
        loading={isLoading}
        title='Thêm mới / cập nhật tài khoản'
        width={1000}
        modalVisible={modalVisible}
        children={<AddEditManager rowSelected={rowSelected} onFinish={handleSubmit} onClose={handleSetModalVisible} />}
      />
    </>
  )
}

export default ManagerPage