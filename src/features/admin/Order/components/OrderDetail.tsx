/* eslint-disable @typescript-eslint/no-unused-vars */
import { IColumnAntD } from 'common/constants/interface'
import OrderStep from './OrderSteps'
import { Styled } from 'styles/stylesComponent'
import { Button, Col, Image, Popconfirm, Row, Tag, Divider } from 'antd'
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ShoppingOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { orderServices } from '../OrderApis'
import { formatPrice, getDataSource, openNotificationError } from 'common/utils'
import { OrderStatus } from '../constants/order.constant'

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  '1': { label: 'Chờ xác nhận', color: '#d46b08', bg: '#fff7e6' },
  '2': { label: 'Chuẩn bị hàng', color: '#096dd9', bg: '#e6f4ff' },
  '3': { label: 'Đang vận chuyển', color: '#7c3aed', bg: '#f3e8ff' },
  '4': { label: 'Hoàn thành', color: '#389e0d', bg: '#f6ffed' },
  '5': { label: 'Đã hủy', color: '#cf1322', bg: '#fff1f0' }
}

function OrderDetail() {
  const { id } = useParams()
  const [textButton, setTextButton] = useState<number>(0)
  const [order, setOrder] = useState<any>({})
  const [products, setProducts] = useState<Array<any>>([])

  const { total_price, address, name, phone, order_status } = order

  const statusInfo = statusConfig[String(order_status)] ?? { label: 'Không xác định', color: '#888', bg: '#f5f5f5' }

  const columnsListAccount: IColumnAntD[] = [
    {
      title: 'STT',
      key: 'STT',
      dataIndex: 'STT',
      width: 60,
      align: 'center' as const
    },
    {
      title: 'Ảnh sản phẩm',
      key: 'product',
      dataIndex: 'product',
      width: 120,
      align: 'center' as const,
      render: (value: any) => (
        <Image width={80} height={80} src={value?.image} style={{ borderRadius: 8, objectFit: 'cover' }} />
      )
    },
    {
      title: 'Tên sản phẩm',
      key: 'product_name',
      dataIndex: 'product',
      render: (value: any) => <span style={{ fontWeight: 500, color: '#1a1a2e' }}>{value?.name}</span>
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      dataIndex: 'quantity',
      align: 'center' as const,
      render: (value: any) => (
        <Tag color='blue' style={{ borderRadius: 20, padding: '0 10px', fontWeight: 600 }}>
          {value}
        </Tag>
      )
    },
    {
      title: 'Đơn giá',
      key: 'price',
      dataIndex: 'price',
      align: 'right' as const,
      render: (value: any) => <span style={{ fontWeight: 600, color: '#ee4d2d' }}>{formatPrice(value)}</span>
    }
  ]

  const getButtonText = (status: number) => {
    switch (status) {
      case 1:
        return 'Xác nhận đơn hàng'
      case 2:
        return 'Vận chuyển'
      case 3:
        return 'Hoàn thành'
      default:
        return 'Đang xử lý'
    }
  }

  const handleNextStep = async () => {
    try {
      await orderServices.nextStep(id)
      handleGetOrder()
    } catch (error) {
      openNotificationError(error)
    }
  }

  const handleCancelOrder = async () => {
    try {
      await orderServices.cancelOrder(id)
      handleGetOrder()
    } catch (error) {
      openNotificationError(error)
    }
  }

  const handleGetOrder = async () => {
    try {
      const res = await orderServices.getById(id)
      if (res) {
        setOrder(res?.data)
        setProducts(getDataSource(res?.data?.order_details, 1))
      }
    } catch (error) {
      console.log('🚀 ~ handleGetOrder ~ error:', error)
    }
  }

  useEffect(() => {
    handleGetOrder()
  }, [])

  const isActionable = order_status !== OrderStatus.PAID && order_status !== OrderStatus.CANCELED

  return (
    <div style={{ padding: '0 4px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShoppingOutlined style={{ fontSize: 22, color: '#1677ff' }} />
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>Chi tiết đơn hàng #{id}</h2>
        </div>
        <Tag
          style={{
            padding: '4px 16px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
            color: statusInfo.color,
            background: statusInfo.bg,
            border: `1px solid ${statusInfo.color}30`
          }}
        >
          {statusInfo.label}
        </Tag>
      </div>

      {/* Stepper */}
      <OrderStep step={Number(order_status)} />

      {/* Main content */}
      <Row gutter={20} style={{ marginTop: 20 }}>
        {/* Product table */}
        <Col span={16}>
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #f0f0f0',
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}
          >
            <div
              style={{
                padding: '14px 20px',
                background: 'linear-gradient(90deg, #1677ff08, transparent)',
                borderBottom: '1px solid #f0f0f0',
                fontWeight: 700,
                fontSize: 14,
                color: '#1a1a2e',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <ShoppingOutlined style={{ color: '#1677ff' }} />
              Danh sách sản phẩm
            </div>
            <Styled.TableStyle
              bordered={false}
              columns={columnsListAccount}
              dataSource={products}
              pagination={false}
              style={{ margin: 0 }}
            />
          </div>
        </Col>

        {/* Order info card */}
        <Col span={8}>
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                padding: '14px 20px',
                background: 'linear-gradient(90deg, #1677ff08, transparent)',
                borderBottom: '1px solid #f0f0f0',
                fontWeight: 700,
                fontSize: 14,
                color: '#1a1a2e'
              }}
            >
              Thông tin khách hàng
            </div>

            <div style={{ padding: '16px 20px' }}>
              {/* Tên khách hàng */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  marginBottom: 16,
                  padding: '12px',
                  background: '#fafafa',
                  borderRadius: 8
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#e6f4ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <UserOutlined style={{ color: '#1677ff', fontSize: 16 }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 2 }}>Tên khách hàng</div>
                  <div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: 14 }}>{name || '—'}</div>
                </div>
              </div>

              {/* SĐT */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  marginBottom: 16,
                  padding: '12px',
                  background: '#fafafa',
                  borderRadius: 8
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#f6ffed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <PhoneOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 2 }}>Số điện thoại</div>
                  <div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: 14 }}>{phone || '—'}</div>
                </div>
              </div>

              {/* Địa chỉ */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  marginBottom: 16,
                  padding: '12px',
                  background: '#fafafa',
                  borderRadius: 8
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#fff7e6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <EnvironmentOutlined style={{ color: '#fa8c16', fontSize: 16 }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 2 }}>Địa chỉ</div>
                  <div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: 14 }}>{address || '—'}</div>
                </div>
              </div>

              <Divider style={{ margin: '8px 0 16px' }} />

              {/* Tổng thanh toán */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  background: 'linear-gradient(135deg, #fff7f0, #fff)',
                  borderRadius: 10,
                  border: '1px solid #ffe7cc',
                  marginBottom: 20
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <DollarOutlined style={{ color: '#ee4d2d', fontSize: 18 }} />
                  <span style={{ fontWeight: 600, color: '#555', fontSize: 14 }}>Tổng thanh toán</span>
                </div>
                <span style={{ fontWeight: 700, color: '#ee4d2d', fontSize: 18 }}>{formatPrice(total_price)}</span>
              </div>

              {/* Action buttons */}
              {isActionable ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Button
                    type='primary'
                    icon={<CheckOutlined />}
                    onClick={handleNextStep}
                    style={{
                      width: '100%',
                      height: 42,
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 14,
                      background: 'linear-gradient(135deg, #1677ff, #4096ff)',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(22,119,255,0.3)'
                    }}
                  >
                    {getButtonText(Number(order_status))}
                  </Button>
                  <Popconfirm
                    title='Hủy đơn hàng'
                    description='Bạn có chắc chắn muốn hủy đơn hàng này không?'
                    onConfirm={handleCancelOrder}
                    okText='Xác nhận hủy'
                    cancelText='Quay lại'
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      danger
                      icon={<CloseOutlined />}
                      style={{
                        width: '100%',
                        height: 42,
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 14
                      }}
                    >
                      Hủy đơn hàng
                    </Button>
                  </Popconfirm>
                </div>
              ) : (
                <Fragment />
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default OrderDetail
