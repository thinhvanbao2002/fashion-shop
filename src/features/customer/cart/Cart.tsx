import {
  ArrowLeftOutlined,
  DeleteOutlined,
  GiftOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons'
import { InputNumber, Select } from 'antd'
import { formatPrice, openNotification, openNotificationError } from 'common/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { USER_PATH } from 'common/constants/paths'
import { cartServices } from './cartApis'

function CartPage() {
  const navigate = useNavigate()
  const [carts, setCarts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const totalPrice = useMemo(
    () =>
      carts.reduce((total: number, item: any) => {
        return total + Number(item.product?.price || 0) * Number(item.product_number || 0)
      }, 0),
    [carts]
  )

  const handleGetAllCart = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await cartServices.get()
      setCarts(res?.data || [])
    } catch (error) {
      openNotificationError(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleDeleteCart = async (cartId: number) => {
    try {
      const res = await cartServices.delete(cartId)
      if (res) {
        setCarts((currentCarts) => currentCarts.filter((item) => item.id !== cartId))
        openNotification('success', 'Thành công', 'Xóa sản phẩm trong giỏ hàng thành công!')
      }
    } catch (error) {
      openNotificationError(error)
    }
  }

  const handleUpdateQuantity = async (cartId: number, quantity: number) => {
    try {
      await cartServices.update(cartId, { product_number: quantity })
      setCarts((currentCarts) =>
        currentCarts.map((item) => (item.id === cartId ? { ...item, product_number: quantity } : item))
      )
    } catch (error) {
      openNotificationError(error)
    }
  }

  const handleUpdateSize = async (cartId: number, size: string) => {
    try {
      await cartServices.update(cartId, { size })
      setCarts((currentCarts) => currentCarts.map((item) => (item.id === cartId ? { ...item, size } : item)))
    } catch (error) {
      openNotificationError(error)
    }
  }

  useEffect(() => {
    handleGetAllCart()
  }, [handleGetAllCart])

  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='border-b border-gray-100 bg-white'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8'>
          <div>
            <div className='mb-1 flex items-center gap-2 text-xs font-medium text-gray-400'>
              <span>Sản phẩm</span>
              <span>/</span>
              <span className='text-[#FFA500]'>Giỏ hàng</span>
            </div>
            <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>Giỏ hàng của bạn</h1>
          </div>
          <div className='hidden items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-[#FF9500] sm:flex'>
            <ShoppingCartOutlined />
            {carts.length} sản phẩm
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10'>
        {isLoading ? (
          <div className='flex min-h-80 items-center justify-center rounded-3xl bg-white text-sm text-gray-500 shadow-sm'>
            Đang tải giỏ hàng...
          </div>
        ) : carts.length === 0 ? (
          <div className='flex min-h-[420px] flex-col items-center justify-center rounded-3xl bg-white px-6 text-center shadow-sm'>
            <div className='mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-3xl text-[#FFA500]'>
              <ShoppingCartOutlined />
            </div>
            <h2 className='text-xl font-bold text-gray-900'>Giỏ hàng đang trống</h2>
            <p className='mt-2 max-w-md text-sm leading-6 text-gray-500'>
              Hãy khám phá các sản phẩm thời trang phù hợp và thêm chúng vào giỏ hàng nhé.
            </p>
            <button
              type='button'
              onClick={() => navigate(USER_PATH.PRODUCT)}
              className='mt-6 flex items-center gap-2 rounded-xl bg-[#FFA500] px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#FF9500] hover:shadow-lg'
            >
              <ArrowLeftOutlined />
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className='grid items-start gap-7 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.75fr)]'>
            <section>
              <div className='mb-5 flex items-end justify-between'>
                <div>
                  <h2 className='text-lg font-bold text-gray-900'>Sản phẩm đã chọn</h2>
                  <p className='mt-1 text-sm text-gray-500'>Kiểm tra size và số lượng trước khi đặt hàng</p>
                </div>
                <button
                  type='button'
                  onClick={() => navigate(USER_PATH.PRODUCT)}
                  className='hidden items-center gap-2 text-sm font-semibold text-[#FFA500] transition-colors hover:text-[#FF9500] sm:flex'
                >
                  <ArrowLeftOutlined />
                  Mua thêm sản phẩm
                </button>
              </div>

              <div className='space-y-4'>
                {carts.map((cart: any) => (
                  <article
                    key={cart.id}
                    className='group rounded-2xl bg-white p-4 shadow-[0_8px_30px_-24px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-24px_rgba(255,165,0,0.45)] sm:p-5'
                  >
                    <div className='flex gap-4 sm:gap-5'>
                      <div className='h-32 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-36 sm:w-28'>
                        <img
                          className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                          src={cart.product?.image}
                          alt={cart.product?.name || 'Sản phẩm'}
                        />
                      </div>

                      <div className='flex min-w-0 flex-1 flex-col justify-between gap-4'>
                        <div className='flex items-start justify-between gap-3'>
                          <div className='min-w-0'>
                            <h3 className='line-clamp-2 font-bold text-gray-900'>{cart.product?.name}</h3>
                            <p className='mt-1.5 text-sm font-semibold text-[#FFA500]'>
                              {formatPrice(cart.product?.price)} VND
                            </p>
                            <span className='mt-2 inline-flex rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-600'>
                              Còn hàng
                            </span>
                          </div>
                          <button
                            type='button'
                            aria-label='Xóa sản phẩm'
                            onClick={() => handleDeleteCart(cart.id)}
                            className='flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500'
                          >
                            <DeleteOutlined />
                          </button>
                        </div>

                        <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
                          <div className='flex gap-3'>
                            <label className='text-xs font-semibold text-gray-500'>
                              <span className='mb-1.5 block'>Kích cỡ</span>
                              <Select
                                className='w-[90px]'
                                value={cart.size}
                                onChange={(value: string) => handleUpdateSize(cart.id, value)}
                                options={[
                                  { value: 's', label: 'S' },
                                  { value: 'm', label: 'M' },
                                  { value: 'l', label: 'L' },
                                  { value: 'xl', label: 'XL' },
                                  { value: '2xl', label: '2XL' }
                                ]}
                              />
                            </label>
                            <label className='text-xs font-semibold text-gray-500'>
                              <span className='mb-1.5 block'>Số lượng</span>
                              <InputNumber
                                min={1}
                                max={99}
                                className='w-[100px]'
                                value={cart.product_number}
                                onChange={(value: number | null) => {
                                  if (value !== null) handleUpdateQuantity(cart.id, value)
                                }}
                              />
                            </label>
                          </div>
                          <div className='text-left sm:text-right'>
                            <p className='text-xs text-gray-400'>Thành tiền</p>
                            <p className='mt-1 text-base font-bold text-gray-900'>
                              {formatPrice(Number(cart.product?.price || 0) * Number(cart.product_number || 0))} VND
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className='sticky top-6 rounded-3xl bg-white p-6 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.35)]'>
              <div className='mb-6 flex items-center gap-3'>
                <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-lg text-[#FFA500]'>
                  <ShoppingCartOutlined />
                </div>
                <div>
                  <h2 className='font-bold text-gray-900'>Thông tin đơn hàng</h2>
                  <p className='mt-0.5 text-xs text-gray-500'>{carts.length} sản phẩm trong giỏ</p>
                </div>
              </div>

              <div className='rounded-2xl bg-gray-50 p-4'>
                <div className='mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700'>
                  <GiftOutlined className='text-[#FFA500]' />
                  Mã khuyến mãi
                </div>
                <div className='flex overflow-hidden rounded-xl bg-white shadow-sm'>
                  <input
                    className='min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-400'
                    type='text'
                    placeholder='Nhập mã ưu đãi'
                  />
                  <button
                    type='button'
                    className='bg-[#FFA500] px-4 text-xs font-bold uppercase text-white transition-colors hover:bg-[#FF9500]'
                  >
                    Áp dụng
                  </button>
                </div>
              </div>

              <div className='my-6 space-y-3 text-sm'>
                <div className='flex items-center justify-between text-gray-500'>
                  <span>Tạm tính</span>
                  <span className='font-semibold text-gray-800'>{formatPrice(totalPrice)} VND</span>
                </div>
                <div className='flex items-center justify-between text-gray-500'>
                  <span>Phí vận chuyển</span>
                  <span className='font-semibold text-green-600'>Miễn phí</span>
                </div>
              </div>

              <div className='mb-6 flex items-end justify-between border-t border-dashed border-gray-200 pt-5'>
                <div>
                  <p className='text-sm font-semibold text-gray-900'>Tổng thanh toán</p>
                  <p className='mt-1 text-xs text-gray-400'>Đã bao gồm các khoản phí</p>
                </div>
                <p className='text-xl font-bold text-[#FFA500]'>{formatPrice(totalPrice)} VND</p>
              </div>

              <button
                type='button'
                onClick={() => navigate(USER_PATH.ORDER, { state: { cart: carts } })}
                className='w-full rounded-xl bg-[#FFA500] px-5 py-3.5 text-sm font-bold uppercase text-white shadow-lg shadow-orange-100 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FF9500] hover:shadow-xl'
              >
                Đặt hàng ngay
              </button>

              <div className='mt-4 flex items-center justify-center gap-2 text-xs text-gray-400'>
                <SafetyCertificateOutlined className='text-green-500' />
                Thanh toán an toàn và bảo mật
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

export default CartPage
