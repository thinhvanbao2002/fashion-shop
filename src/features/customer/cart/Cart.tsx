/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputNumber, Select } from 'antd'
import CustomButton from 'common/components/button/Button'
import { formatPrice, openNotification, openNotificationError } from 'common/utils'
import { useCallback, useEffect, useState } from 'react'
import { cartServices } from './cartApis'
import { useNavigate } from 'react-router'
import { USER_PATH } from 'common/constants/paths'

function CartPage() {
  const navigate = useNavigate()
  const [cartId, setCartId] = useState<number>()
  const [carts, setCarts] = useState<any>([])
  console.log('🚀 ~ CartPage ~ carts:', carts)
  const [totalPrice, setTotalPrice] = useState(0)
  const [cartPayload, setCartPayload] = useState<any>({})

  const handleGetAllCart = useCallback(async () => {
    try {
      const res = await cartServices.get()
      if (res) {
        setCarts(res?.data)
      }
    } catch (error) {
      openNotificationError(error)
    }
  }, [])

  const handleDeleteCart = useCallback(async (cartId: number) => {
    try {
      const res = await cartServices.delete(cartId)
      if (res) {
        openNotification('success', 'Thành công', 'Xóa sản phẩm trong giỏ hàng thành công!')
        handleGetAllCart()
      }
    } catch (error) {
      openNotificationError(error)
    }
  }, [])

  const handleCalculateTheTotalAmount = useCallback(() => {
    try {
      if (carts && carts.length) {
        const totalAmount = carts.reduce((acc: number, item: any) => {
          return item.product?.price * item.product_number + acc
        }, 0)
        setTotalPrice(totalAmount)
      } else {
        setTotalPrice(0)
      }
    } catch (error) {
      console.log('🚀 ~ handleCalculateTheTotalAmount ~ error:', error)
    }
  }, [carts])

  const handleUpdateQuantity = useCallback(
    async (cartId: number, quantity: number) => {
      try {
        await cartServices.update(cartId, { product_number: quantity })
        const updatedCarts = carts.map((item: any) => {
          if (item.id === cartId) {
            return {
              ...item,
              product_number: quantity,
              total_price: item.product?.price * quantity
            }
          }
          return item
        })
        setCarts(updatedCarts)
        handleCalculateTheTotalAmount()
      } catch (error) {
        openNotificationError(error)
      }
    },
    [carts]
  )

  useEffect(() => {
    handleGetAllCart()
  }, [])

  useEffect(() => {
    handleCalculateTheTotalAmount()
  }, [carts])

  return (
    <>
      <div className='w-full h-[50px] pl-20 pr-20'>
        <div className='w-full border-b-2 h-[50px] flex items-center justify-start text-custom-sm'>
          <span>Giỏ hàng</span>
          <div className='border-r-2 border-border-basic ml-2 mr-2 w-[1px] h-[16px]'></div>
          <span className='font-semibold'>Thông tin giỏ hàng</span>
        </div>
      </div>
      <div className='w-full pl-20 pr-20 pt-10 pb-20 flex sm:flex-col md:flex-col lg:flex-row'>
        <div className='p-6 sm:w-full md:w-full lg:w-[60%] flex'>
          <div className='flex flex-col w-full'>
            {carts &&
              carts.length > 0 &&
              carts.map((c: any) => (
                <div className='mb-6 '>
                  <div className='flex'>
                    <div className='mr-5'>
                      <img className='w-[160px] h-full object-cover' src={c.product?.image} alt='' />
                    </div>
                    <div className='flex flex-col justify-between w-[70%]'>
                      <div>
                        <div>
                          <div>
                            <h2 className='text-custom-sm font-semibold uppercase'>{c?.product?.name}</h2>
                          </div>
                          <div className='flex items-center mt-2'>
                            <span className='text-custom-xs'>Giá:</span>
                            <h3 className='ml-1 text-custom-sm font-semibold'>{formatPrice(c.product?.price)} VND</h3>
                          </div>
                        </div>
                        <div className='flex'>
                          <div className='mr-10'>
                            <div className='text-custom-sm'>Size</div>
                            <div>
                              <Select
                                style={{ width: 100 }}
                                value={c.size}
                                onChange={async (value: string) => {
                                  await cartServices.update(c.id, { size: value })
                                  handleGetAllCart()
                                }}
                                options={[
                                  { value: 's', label: 'S' },
                                  { value: 'm', label: 'M' },
                                  { value: 'l', label: 'L' },
                                  { value: 'xl', label: 'XL' },
                                  { value: '2xl', label: '2XL' }
                                ]}
                              />
                            </div>
                          </div>
                          <div>
                            <div className='text-custom-sm'>Số lượng</div>
                            <div>
                              <InputNumber
                                min={1}
                                max={99}
                                style={{ width: 100 }}
                                value={c.product_number}
                                onChange={(value: number | null) => {
                                  if (value !== null) {
                                    handleUpdateQuantity(c.id, value)
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='w-[30%] text-right flex flex-col justify-between'>
                      <div>
                        <div>
                          <h2 className='text-custom-xl font-semibold text-money'>{formatPrice(c.total_price)} VND</h2>
                        </div>
                        <div>
                          <span className='text-custom-xs text-money italic'>Còn hàng</span>
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            handleDeleteCart(c.id)
                          }}
                          className='pt-2 pb-2 w-[100px] bg-black text-while text-custom-xs rounded-lg hover:text-while hover:bg-money transform transition-all'
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className='p-6 sm:w-full md:w-full lg:w-[40%] bg-[#f5f5f5]'>
          <div>
            <h2 className='text-custom-xl font-semibold uppercase '>Thông tin đơn hàng</h2>
          </div>
          <div className='w-full border-t-2 border mt-6'></div>
          <div className='mt-6'>
            <h3 className='text-custom-sm uppercase font-semibold mb-2'>Nhập mã khuyến mãi</h3>
            <div>
              <div className='bg-baseBackground relative flex border border-[#ccc] rounded-lg overflow-hidden'>
                <input className='border-none outline-none w-full text-custom-sm pl-3 h-51px ' type='text' />
                <button className='uppercase right-0 w-[30%] h-[51px] top-0 pl-6 pr-6 pt-2 pb-2 bg-money text-custom-xs font-semibold text-while hover:opacity-55'>
                  áp dụng
                </button>
              </div>
            </div>
          </div>
          <div className='w-full border-t-2 border-dashed mt-6'></div>
          <div className='mt-6 mb-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-custom-sm text-[#808080] font-semibold'>Đơn hàng</h3>
              <h3 className='text-custom-xl text-[#808080] font-semibold'>{formatPrice(totalPrice)}VNĐ</h3>
            </div>
            {/* <div className='flex items-center justify-between'>
              <h3 className='text-custom-sm text-[#808080] font-semibold'>Giảm</h3>
              <h3 className='text-custom-xl text-[#808080]'>87.000 VNĐ</h3>
            </div> */}
          </div>
          <div className='w-full border-t-2 border-dashed mt-6'></div>
          <div className='mt-6 mb-6 text-custom-xl uppercase flex items-center justify-between'>
            <div className='font-semibold'>Tạm tính</div>
            <div className='font-extrabold text-money'>{formatPrice(totalPrice)} VNĐ</div>
          </div>
          <div className='mt-16'>
            <CustomButton
              label='Đặt hàng ngay'
              onClick={() => {
                navigate(`${USER_PATH.ORDER}`, { state: { cart: carts } })
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default CartPage
