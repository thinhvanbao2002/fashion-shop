import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Form, Input, Select } from 'antd'
import Config from 'common/constants/config'
import { USER_PATH } from 'common/constants/paths'
import { formatPrice, getOptionListSelector, openNotification, openNotificationError } from 'common/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { orderServices } from './orderApis'

const { TextArea } = Input

function OrderPage() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const location = useLocation()
  const listOrders = useMemo(() => location.state?.cart || [], [location.state])

  const [provinces, setProvinces] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const listProvince = getOptionListSelector(provinces, 'name', 'id')
  const listDistrict = getOptionListSelector(districts, 'name', 'id')
  const listWards = getOptionListSelector(wards, 'name', 'id')

  const totalPrice = useMemo(
    () =>
      listOrders.reduce((total: number, item: any) => {
        return total + Number(item.product?.price || 0) * Number(item.product_number || 0)
      }, 0),
    [listOrders]
  )

  const getProvince = useCallback(async () => {
    try {
      const res = await orderServices.getProvince()
      setProvinces(res?.data || [])
    } catch (error) {
      openNotificationError(error)
    }
  }, [])

  const getDistricts = useCallback(async (provinceId: string) => {
    try {
      const res = await orderServices.getDistrict(provinceId)
      setDistricts(res?.data || [])
    } catch (error) {
      openNotificationError(error)
    }
  }, [])

  const getWards = useCallback(async (districtId: string) => {
    try {
      const res = await orderServices.getWards(districtId)
      setWards(res?.data || [])
    } catch (error) {
      openNotificationError(error)
    }
  }, [])

  const handleSubmit = async (value: any) => {
    if (!listOrders.length || isSubmitting) return

    try {
      setIsSubmitting(true)
      const res = await orderServices.createOrder({ ...value, items: listOrders, total_price: totalPrice })
      if (res) {
        navigate(USER_PATH.ORDER_SUCCESS)
        openNotification('success', 'Thành công', 'Bạn đã đặt hàng thành công!')
      }
    } catch (error) {
      openNotificationError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    getProvince()
  }, [getProvince])

  useEffect(() => {
    if (province) getDistricts(province)
  }, [province, getDistricts])

  useEffect(() => {
    if (district) getWards(district)
  }, [district, getWards])

  if (!listOrders.length) {
    return (
      <main className='min-h-screen bg-gray-50 px-5 py-12 sm:px-8'>
        <div className='mx-auto flex min-h-[420px] max-w-4xl flex-col items-center justify-center rounded-3xl bg-white px-6 text-center shadow-sm'>
          <div className='mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-3xl text-[#FFA500]'>
            <ShoppingCartOutlined />
          </div>
          <h1 className='text-xl font-bold text-gray-900'>Chưa có sản phẩm để đặt hàng</h1>
          <p className='mt-2 text-sm text-gray-500'>
            Vui lòng quay lại giỏ hàng và chọn sản phẩm trước khi thanh toán.
          </p>
          <button
            type='button'
            onClick={() => navigate(USER_PATH.CART)}
            className='mt-6 rounded-xl bg-[#FFA500] px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#FF9500] hover:shadow-lg'
          >
            Quay lại giỏ hàng
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='border-b border-gray-100 bg-white'>
        <div className='mx-auto max-w-7xl px-5 py-5 sm:px-8'>
          <div className='mb-1 flex items-center gap-2 text-xs font-medium text-gray-400'>
            <span>Giỏ hàng</span>
            <span>/</span>
            <span className='text-[#FFA500]'>Thanh toán</span>
          </div>
          <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>Hoàn tất đơn hàng</h1>
        </div>
      </div>

      <Form
        form={form}
        name='checkout'
        labelAlign='left'
        onFinish={handleSubmit}
        scrollToFirstError
        layout='vertical'
        requiredMark={false}
      >
        <div className='mx-auto grid max-w-7xl items-start gap-7 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.75fr)]'>
          <section className='rounded-3xl bg-white p-5 shadow-[0_16px_50px_-32px_rgba(15,23,42,0.35)] sm:p-8'>
            <div className='mb-7 flex items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-lg text-[#FFA500]'>
                <EnvironmentOutlined />
              </div>
              <div>
                <h2 className='text-lg font-bold text-gray-900'>Thông tin giao hàng</h2>
                <p className='mt-0.5 text-xs text-gray-500'>Điền thông tin người nhận và địa chỉ giao hàng</p>
              </div>
            </div>

            <div className='grid gap-x-5 sm:grid-cols-2'>
              <Form.Item
                label='Họ và tên'
                name='name'
                rules={[
                  { required: true, message: 'Vui lòng nhập họ và tên!' },
                  { pattern: Config._reg.name, message: 'Họ và tên không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined className='text-gray-300' />}
                  className='h-11'
                  placeholder='Nguyễn Văn A'
                />
              </Form.Item>

              <Form.Item
                label='Số điện thoại'
                name='phone'
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: Config._reg.phone, message: 'Số điện thoại không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined className='text-gray-300' />}
                  className='h-11'
                  placeholder='Nhập số điện thoại'
                />
              </Form.Item>
            </div>

            <Form.Item
              label='Email'
              name='email'
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { pattern: Config._reg.email, message: 'Email không hợp lệ!' }
              ]}
            >
              <Input
                type='email'
                prefix={<MailOutlined className='text-gray-300' />}
                className='h-11'
                placeholder='example@email.com'
              />
            </Form.Item>

            <div className='my-7 h-px bg-gray-100' />

            <h3 className='mb-5 font-bold text-gray-900'>Địa chỉ nhận hàng</h3>
            <div className='grid gap-x-5 sm:grid-cols-2'>
              <Form.Item
                label='Tỉnh / Thành phố'
                name='city'
                rules={[{ required: true, message: 'Vui lòng chọn tỉnh hoặc thành phố!' }]}
              >
                <Select
                  className='h-11'
                  showSearch
                  placeholder='Chọn tỉnh / thành phố'
                  optionFilterProp='label'
                  onChange={(value) => {
                    setProvince(value)
                    setDistrict('')
                    setDistricts([])
                    setWards([])
                    form.setFieldsValue({ district: undefined, ward: undefined })
                  }}
                  options={listProvince}
                />
              </Form.Item>

              <Form.Item
                label='Quận / Huyện'
                name='district'
                rules={[{ required: true, message: 'Vui lòng chọn quận hoặc huyện!' }]}
              >
                <Select
                  className='h-11'
                  showSearch
                  disabled={!province}
                  placeholder='Chọn quận / huyện'
                  optionFilterProp='label'
                  onChange={(value) => {
                    setDistrict(value)
                    setWards([])
                    form.setFieldValue('ward', undefined)
                  }}
                  options={listDistrict}
                />
              </Form.Item>
            </div>

            <div className='grid gap-x-5 sm:grid-cols-2'>
              <Form.Item
                label='Phường / Xã'
                name='ward'
                rules={[{ required: true, message: 'Vui lòng chọn phường hoặc xã!' }]}
              >
                <Select
                  className='h-11'
                  showSearch
                  disabled={!district}
                  placeholder='Chọn phường / xã'
                  optionFilterProp='label'
                  options={listWards}
                />
              </Form.Item>

              <Form.Item
                label='Địa chỉ chi tiết'
                name='address'
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết!' }]}
              >
                <Input className='h-11' placeholder='Số nhà, tên đường...' />
              </Form.Item>
            </div>

            <Form.Item label='Ghi chú đơn hàng' name='note' className='mb-0'>
              <TextArea
                className='!resize-none !rounded-xl'
                placeholder='Ghi chú thêm cho cửa hàng hoặc đơn vị vận chuyển'
                autoSize={{ minRows: 3, maxRows: 5 }}
                maxLength={500}
                showCount
              />
            </Form.Item>
          </section>

          <aside className='sticky top-6 rounded-3xl bg-white p-5 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.35)] sm:p-6'>
            <div className='mb-5 flex items-center justify-between'>
              <div>
                <h2 className='font-bold text-gray-900'>Đơn hàng của bạn</h2>
                <p className='mt-0.5 text-xs text-gray-500'>{listOrders.length} sản phẩm</p>
              </div>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#FFA500]'>
                <ShoppingCartOutlined />
              </div>
            </div>

            <div className='max-h-[330px] space-y-4 overflow-y-auto pr-1'>
              {listOrders.map((item: any) => {
                const itemTotal = Number(item.product?.price || 0) * Number(item.product_number || 0)

                return (
                  <div key={item.id} className='flex gap-3 rounded-2xl bg-gray-50/80 p-3'>
                    <div className='h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100'>
                      <img
                        className='h-full w-full object-cover'
                        src={item.product?.image}
                        alt={item.product?.name || 'Sản phẩm'}
                      />
                    </div>
                    <div className='flex min-w-0 flex-1 flex-col justify-between'>
                      <div>
                        <h3 className='line-clamp-2 text-sm font-bold text-gray-800'>{item.product?.name}</h3>
                        <p className='mt-1 text-xs text-gray-400'>
                          Size {String(item.size || '').toUpperCase()} · Số lượng {item.product_number}
                        </p>
                      </div>
                      <p className='text-sm font-bold text-[#FFA500]'>{formatPrice(itemTotal)} VND</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className='my-5 border-t border-dashed border-gray-200' />

            <div className='space-y-3 text-sm'>
              <div className='flex justify-between text-gray-500'>
                <span>Tạm tính</span>
                <span className='font-semibold text-gray-800'>{formatPrice(totalPrice)} VND</span>
              </div>
              <div className='flex justify-between text-gray-500'>
                <span>Phí vận chuyển</span>
                <span className='font-semibold text-green-600'>Miễn phí</span>
              </div>
              <div className='flex justify-between text-gray-500'>
                <span>Phí thanh toán</span>
                <span className='font-semibold text-gray-800'>0 VND</span>
              </div>
            </div>

            <div className='my-5 border-t border-dashed border-gray-200' />

            <div className='mb-5 flex items-end justify-between gap-4'>
              <div>
                <p className='font-bold text-gray-900'>Tổng thanh toán</p>
                <p className='mt-1 text-xs text-gray-400'>Đã bao gồm các khoản phí</p>
              </div>
              <p className='whitespace-nowrap text-xl font-bold text-[#FFA500]'>{formatPrice(totalPrice)} VND</p>
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full rounded-xl bg-[#FFA500] px-5 py-3.5 text-sm font-bold uppercase text-white shadow-lg shadow-orange-100 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FF9500] hover:shadow-xl disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none'
            >
              {isSubmitting ? 'Đang xử lý đơn hàng...' : 'Hoàn tất đặt hàng'}
            </button>

            <div className='mt-4 flex items-center justify-center gap-2 text-xs text-gray-400'>
              <SafetyCertificateOutlined className='text-green-500' />
              Thông tin của bạn được bảo mật
            </div>
          </aside>
        </div>
      </Form>
    </main>
  )
}

export default OrderPage
