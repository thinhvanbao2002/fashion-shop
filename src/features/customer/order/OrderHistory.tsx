import {
  CalendarOutlined,
  CloseCircleOutlined,
  InboxOutlined,
  ShoppingOutlined,
  WarningOutlined
} from '@ant-design/icons'
import { Modal } from 'antd'
import { ORDER_TYPE } from 'common/constants/constants'
import { formatDate, formatPrice, openNotification, openNotificationError, vldOrderStatus } from 'common/utils'
import { useCallback, useEffect, useState } from 'react'
import { orderServices } from './orderApis'

const cancellableStatuses = [ORDER_TYPE.PENDING, ORDER_TYPE.PROCESSING]

const getStatusClassName = (status: string) => {
  switch (status) {
    case ORDER_TYPE.PENDING:
      return 'bg-amber-50 text-amber-700'
    case ORDER_TYPE.PROCESSING:
      return 'bg-blue-50 text-blue-700'
    case ORDER_TYPE.WAITING_FOR_PAYMENT:
      return 'bg-purple-50 text-purple-700'
    case ORDER_TYPE.PAID:
      return 'bg-green-50 text-green-700'
    case ORDER_TYPE.CANCELED:
      return 'bg-red-50 text-red-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

function OrderHistory() {
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [orderId, setOrderId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCanceling, setIsCanceling] = useState(false)

  const handleGetOrders = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await orderServices.getOrders({})
      setOrders(res?.data || [])
    } catch (error) {
      openNotificationError(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const closeCancelModal = () => {
    setCancelModalVisible(false)
    setOrderId(null)
  }

  const handleCancelOrder = async () => {
    if (!orderId || isCanceling) return

    try {
      setIsCanceling(true)
      const res = await orderServices.cancelOrder(orderId)
      if (res) {
        openNotification('success', 'Thành công', 'Hủy đơn hàng thành công!')
        closeCancelModal()
        await handleGetOrders()
      }
    } catch (error) {
      openNotificationError(error)
    } finally {
      setIsCanceling(false)
    }
  }

  useEffect(() => {
    handleGetOrders()
  }, [handleGetOrders])

  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='border-b border-gray-100 bg-white'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8'>
          <div>
            <div className='mb-1 flex items-center gap-2 text-xs font-medium text-gray-400'>
              <span>Tài khoản</span>
              <span>/</span>
              <span className='text-[#FFA500]'>Đơn hàng</span>
            </div>
            <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>Lịch sử đơn hàng</h1>
          </div>
          <div className='hidden items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-[#FF9500] sm:flex'>
            <ShoppingOutlined />
            {orders.length} đơn hàng
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10'>
        {isLoading ? (
          <div className='flex min-h-80 items-center justify-center rounded-3xl bg-white text-sm text-gray-500 shadow-sm'>
            Đang tải lịch sử đơn hàng...
          </div>
        ) : orders.length === 0 ? (
          <div className='flex min-h-[420px] flex-col items-center justify-center rounded-3xl bg-white px-6 text-center shadow-sm'>
            <div className='mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-3xl text-[#FFA500]'>
              <InboxOutlined />
            </div>
            <h2 className='text-xl font-bold text-gray-900'>Bạn chưa có đơn hàng nào</h2>
            <p className='mt-2 max-w-md text-sm leading-6 text-gray-500'>
              Các đơn hàng sau khi đặt sẽ xuất hiện tại đây để bạn tiện theo dõi.
            </p>
          </div>
        ) : (
          <div className='space-y-5'>
            {orders.map((order) => {
              const canCancel = cancellableStatuses.includes(order.order_status)

              return (
                <article
                  key={order.id}
                  className='overflow-hidden rounded-3xl bg-white shadow-[0_14px_45px_-32px_rgba(15,23,42,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_55px_-32px_rgba(255,165,0,0.45)]'
                >
                  <div className='flex flex-col gap-3 bg-gradient-to-r from-orange-50/90 to-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#FFA500] shadow-sm'>
                        <ShoppingOutlined />
                      </div>
                      <div>
                        <p className='text-xs text-gray-400'>Mã đơn hàng</p>
                        <p className='mt-0.5 font-bold text-gray-900'>#{order.id}</p>
                      </div>
                    </div>
                    <span
                      className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${getStatusClassName(order.order_status)}`}
                    >
                      {vldOrderStatus(order.order_status)}
                    </span>
                  </div>

                  <div className='divide-y divide-gray-100 px-5 sm:px-6'>
                    {(order.order_details || []).map((detail: any) => (
                      <div key={detail.id} className='flex gap-4 py-5'>
                        <div className='h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-28 sm:w-24'>
                          <img
                            className='h-full w-full object-cover'
                            src={detail.product?.image}
                            alt={detail.product?.name || 'Sản phẩm'}
                          />
                        </div>
                        <div className='flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center'>
                          <div className='min-w-0'>
                            <h3 className='line-clamp-2 text-sm font-bold text-gray-900 sm:text-base'>
                              {detail.product?.name}
                            </h3>
                            <p className='mt-2 text-xs text-gray-400'>Số lượng: {detail.product_number}</p>
                          </div>
                          <div className='flex-shrink-0 text-left sm:text-right'>
                            <p className='text-xs text-gray-400'>Đơn giá</p>
                            <p className='mt-1 font-bold text-[#FFA500]'>{formatPrice(detail.product?.price)} VND</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='flex flex-col gap-4 bg-gray-50/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
                    <div className='flex items-center gap-2 text-sm text-gray-500'>
                      <CalendarOutlined className='text-[#FFA500]' />
                      <span>Ngày đặt hàng:</span>
                      <span className='font-semibold text-gray-800'>{formatDate(order.created_at)}</span>
                    </div>

                    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5'>
                      <div className='flex items-end justify-between gap-3 sm:block sm:text-right'>
                        <p className='text-xs text-gray-400'>Tổng thanh toán</p>
                        <p className='mt-1 text-lg font-bold text-[#FFA500]'>{formatPrice(order.total_price)} VND</p>
                      </div>
                      <button
                        type='button'
                        disabled={!canCancel}
                        onClick={() => {
                          setOrderId(order.id)
                          setCancelModalVisible(true)
                        }}
                        className='flex items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-xs font-bold text-red-500 transition-all hover:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-100 disabled:text-gray-400'
                      >
                        <CloseCircleOutlined />
                        {canCancel ? 'Hủy đơn hàng' : 'Không thể hủy'}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      <Modal open={cancelModalVisible} onCancel={closeCancelModal} footer={null} centered width={420}>
        <div className='px-2 pb-2 pt-4 text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl text-red-500'>
            <WarningOutlined />
          </div>
          <h2 className='text-xl font-bold text-gray-900'>Xác nhận hủy đơn hàng</h2>
          <p className='mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-500'>
            Bạn có chắc chắn muốn hủy đơn hàng này? Thao tác này không thể hoàn tác.
          </p>
          <div className='mt-6 grid grid-cols-2 gap-3'>
            <button
              type='button'
              onClick={closeCancelModal}
              className='rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-200'
            >
              Quay lại
            </button>
            <button
              type='button'
              disabled={isCanceling}
              onClick={handleCancelOrder}
              className='rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300'
            >
              {isCanceling ? 'Đang hủy...' : 'Xác nhận hủy'}
            </button>
          </div>
        </div>
      </Modal>
    </main>
  )
}

export default OrderHistory
