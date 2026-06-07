import { ArrowRightOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons'
import { Form, Input, Spin } from 'antd'
import LocalStorage from 'apis/localStorage'
import { USER_PATH } from 'common/constants/paths'
import { openNotification, openNotificationError } from 'common/utils'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setLogin } from 'redux/slice/login.slice'
import { authService } from './service/Apis'

function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (value: any) => {
    try {
      setIsLoading(true)
      const res: any = await authService.login({
        phone: value?.phone,
        password: value?.password
      })

      if (res.status) {
        LocalStorage.setToken(res?.data?.token)
        LocalStorage.setData(res?.data?.id)
        LocalStorage.setRole(res?.data?.role)
        dispatch(setLogin(res?.data))
        openNotification('success', 'Thành công!', 'Đăng nhập thành công.')
        navigate('/')
      }
    } catch (error) {
      openNotificationError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className='relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 px-5 py-8 sm:px-8'>
      {/* <div className='absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#FFA500]/15 blur-3xl' />
      <div className='absolute -bottom-40 -right-28 h-[430px] w-[430px] rounded-full bg-[#FF9500]/15 blur-3xl' />
      <div className='absolute left-1/2 top-14 h-24 w-24 rounded-full border border-white/70 bg-white/30 shadow-xl backdrop-blur-xl' /> */}

      <Spin spinning={isLoading} fullscreen />

      <div className='relative grid w-full max-w-5xl overflow-hidden rounded-[32px] bg-white/80 shadow-[0_30px_90px_-45px_rgba(255,149,0,0.55)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]'>
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

            <h1 className='mt-14 max-w-md text-4xl font-bold leading-tight'>Chào mừng bạn quay trở lại</h1>
            <p className='mt-4 max-w-md text-sm leading-7 text-orange-50'>
              Đăng nhập để tiếp tục mua sắm, theo dõi đơn hàng và khám phá những sản phẩm mới nhất.
            </p>
          </div>
        </section>

        <section className='px-5 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14'>
          <button type='button' onClick={() => navigate('/')} className='mb-8 flex items-center gap-3 lg:hidden'>
            <img className='h-12 w-12 rounded-xl object-cover shadow-sm' src='/LOGO-WEBSHOP.jpg' alt='TaoBao shop' />
            <span className='text-lg font-bold text-gray-900'>TaoBao shop</span>
          </button>

          <div className='mb-8'>
            <span className='inline-flex rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-[#FF9500]'>
              Chào mừng trở lại
            </span>
            <h2 className='mt-4 text-3xl font-bold text-gray-900'>Đăng nhập</h2>
            <p className='mt-2 text-sm leading-6 text-gray-500'>
              Nhập thông tin tài khoản để tiếp tục với TaoBao shop.
            </p>
          </div>

          <Form onFinish={handleSubmit} layout='vertical' requiredMark={false} size='large'>
            <Form.Item
              label='Số điện thoại'
              name='phone'
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
            >
              <Input
                prefix={<PhoneOutlined className='mr-1 text-[#FFA500]' />}
                className='!h-12 !rounded-xl !border-gray-100 !bg-gray-50/80 hover:!border-orange-200 focus:!border-[#FFA500]'
                placeholder='Nhập số điện thoại'
                autoComplete='tel'
              />
            </Form.Item>

            <Form.Item
              label='Mật khẩu'
              name='password'
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className='mr-1 text-[#FFA500]' />}
                className='!h-12 !rounded-xl !border-gray-100 !bg-gray-50/80 hover:!border-orange-200 focus:!border-[#FFA500]'
                placeholder='Nhập mật khẩu'
                autoComplete='current-password'
              />
            </Form.Item>

            <button
              type='submit'
              disabled={isLoading}
              className='group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFA500] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-100 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FF9500] hover:shadow-xl disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none'
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              {!isLoading && <ArrowRightOutlined className='transition-transform group-hover:translate-x-1' />}
            </button>
          </Form>

          <div className='my-7 flex items-center gap-3'>
            <div className='h-px flex-1 bg-gray-100' />
            <span className='text-xs text-gray-400'>Bạn chưa có tài khoản?</span>
            <div className='h-px flex-1 bg-gray-100' />
          </div>

          <button
            type='button'
            onClick={() => navigate(USER_PATH.REGISTER)}
            className='w-full rounded-xl border border-orange-100 bg-orange-50/60 px-5 py-3 text-sm font-bold text-[#FF9500] transition-all hover:border-orange-200 hover:bg-orange-50'
          >
            Đăng ký tài khoản mới
          </button>

          <p className='mt-7 text-center text-xs leading-5 text-gray-400'>
            Bằng việc đăng nhập, bạn đồng ý với các điều khoản và chính sách của TaoBao shop.
          </p>
        </section>
      </div>
    </main>
  )
}

export default LoginPage
