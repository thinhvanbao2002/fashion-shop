import {
  ArrowRightOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Form, Input, Spin } from 'antd'
import Config from 'common/constants/config'
import { USER_PATH } from 'common/constants/paths'
import { openNotification, openNotificationError } from 'common/utils'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { accountServices } from '../account/accountApis'

function RegisterPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true)
      const res = await accountServices.register(values)

      if (res) {
        openNotification('success', 'Thành công', 'Đăng ký tài khoản thành công')
        navigate(USER_PATH.LOGIN)
      }
    } catch (error) {
      openNotificationError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className='relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 px-5 py-8 sm:px-8'>
      <Spin spinning={isLoading} fullscreen />

      <div className='relative grid w-full max-w-6xl overflow-hidden rounded-[32px] bg-white/80 shadow-[0_30px_90px_-45px_rgba(255,149,0,0.55)] backdrop-blur-xl lg:grid-cols-[0.85fr_1.15fr]'>
        <section className='relative hidden overflow-hidden bg-gradient-to-br from-[#FF9500] via-[#FFA500] to-[#FFB52E] p-10 text-white lg:flex lg:flex-col lg:justify-between'>
          <div className='relative'>
            <button
              type='button'
              onClick={() => navigate('/')}
              className='flex items-center gap-3 rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-md transition-colors hover:bg-white/20'
            >
              <img className='h-12 w-12 rounded-xl object-cover' src='/LOGO-WEBSHOP.jpg' alt='TaoBao shop' />
              <div className='text-left'>
                <p className='text-lg font-bold'>TaoBao shop</p>
                <p className='text-xs text-orange-50'>Thời trang dành cho bạn</p>
              </div>
            </button>

            <h1 className='mt-14 max-w-md text-4xl font-bold leading-tight'>Bắt đầu hành trình cùng TaoBao shop</h1>
            <p className='mt-4 max-w-md text-sm leading-7 text-orange-50'>
              Tạo tài khoản để mua sắm thuận tiện hơn, lưu thông tin và theo dõi mọi đơn hàng của bạn.
            </p>
          </div>

          <div className='relative rounded-3xl bg-white/10 p-5 backdrop-blur-sm'>
            <SafetyCertificateOutlined className='text-2xl' />
            <h2 className='mt-3 font-bold'>Đăng ký nhanh chóng và bảo mật</h2>
            <p className='mt-2 text-xs leading-6 text-orange-50'>
              Thông tin tài khoản của bạn được sử dụng để nâng cao trải nghiệm mua sắm tại TaoBao shop.
            </p>
          </div>
        </section>

        <section className='px-5 py-7 sm:px-10 sm:py-9 lg:px-14 lg:py-10'>
          <button type='button' onClick={() => navigate('/')} className='mb-6 flex items-center gap-3 lg:hidden'>
            <img className='h-12 w-12 rounded-xl object-cover shadow-sm' src='/LOGO-WEBSHOP.jpg' alt='TaoBao shop' />
            <span className='text-lg font-bold text-gray-900'>TaoBao shop</span>
          </button>

          <div className='mb-6'>
            <span className='inline-flex rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-[#FF9500]'>
              Thành viên mới
            </span>
            <h2 className='mt-3 text-3xl font-bold text-gray-900'>Đăng ký tài khoản</h2>
            <p className='mt-2 text-sm leading-6 text-gray-500'>
              Điền thông tin bên dưới để tạo tài khoản TaoBao shop.
            </p>
          </div>

          <Form onFinish={handleSubmit} layout='vertical' requiredMark={false} size='large'>
            <div className='grid gap-x-4 sm:grid-cols-2'>
              <Form.Item
                label='Họ và tên'
                name='name'
                rules={[
                  { required: true, message: 'Vui lòng nhập họ và tên!' },
                  { pattern: Config._reg.name, message: 'Họ và tên không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined className='mr-1 text-[#FFA500]' />}
                  className='!h-12 !rounded-xl !border-gray-100 !bg-gray-50/80 hover:!border-orange-200 focus:!border-[#FFA500]'
                  placeholder='Nguyễn Văn A'
                  autoComplete='name'
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
                  prefix={<PhoneOutlined className='mr-1 text-[#FFA500]' />}
                  className='!h-12 !rounded-xl !border-gray-100 !bg-gray-50/80 hover:!border-orange-200 focus:!border-[#FFA500]'
                  placeholder='Nhập số điện thoại'
                  autoComplete='tel'
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
                prefix={<MailOutlined className='mr-1 text-[#FFA500]' />}
                className='!h-12 !rounded-xl !border-gray-100 !bg-gray-50/80 hover:!border-orange-200 focus:!border-[#FFA500]'
                placeholder='example@email.com'
                autoComplete='email'
              />
            </Form.Item>

            <div className='grid gap-x-4 sm:grid-cols-2'>
              <Form.Item
                label='Mật khẩu'
                name='password'
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { pattern: Config._reg.pass, message: 'Mật khẩu không hợp lệ!' }
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined className='mr-1 text-[#FFA500]' />}
                  className='!h-12 !rounded-xl !border-gray-100 !bg-gray-50/80 hover:!border-orange-200 focus:!border-[#FFA500]'
                  placeholder='Nhập mật khẩu'
                  autoComplete='new-password'
                />
              </Form.Item>

              <Form.Item
                label='Nhập lại mật khẩu'
                name='confirmPassword'
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'))
                    }
                  })
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className='mr-1 text-[#FFA500]' />}
                  className='!h-12 !rounded-xl !border-gray-100 !bg-gray-50/80 hover:!border-orange-200 focus:!border-[#FFA500]'
                  placeholder='Xác nhận mật khẩu'
                  autoComplete='new-password'
                />
              </Form.Item>
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFA500] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-100 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FF9500] hover:shadow-xl disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none'
            >
              {isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
              {!isLoading && <ArrowRightOutlined className='transition-transform group-hover:translate-x-1' />}
            </button>
          </Form>

          <div className='mt-6 flex items-center justify-center gap-1.5 text-sm text-gray-500'>
            <span>Đã có tài khoản?</span>
            <button
              type='button'
              onClick={() => navigate(USER_PATH.LOGIN)}
              className='font-bold text-[#FF9500] transition-colors hover:text-[#FFA500]'
            >
              Đăng nhập ngay
            </button>
          </div>

          <p className='mt-5 text-center text-xs leading-5 text-gray-400'>
            Bằng việc đăng ký, bạn đồng ý với các điều khoản và chính sách của TaoBao shop.
          </p>
        </section>
      </div>
    </main>
  )
}

export default RegisterPage
