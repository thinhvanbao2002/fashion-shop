import React, { useCallback, useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, Form, Input, Layout } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useNavigate } from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons'
import { MenuProps } from 'antd/lib'
import { useDispatch, useSelector } from 'react-redux'
import { setLogin } from 'redux/slice/login.slice'
import { openNotification } from 'common/utils'
import _ from 'lodash'
import { USER_PATH } from 'common/constants/paths'

const { Header, Footer, Content } = Layout

const headerStyle: React.CSSProperties = {
  color: '#fff'
}

const layoutStyle = {
  overflow: 'hidden',
  width: '100vw',
  maxWidth: '100%'
}

const UserLayout: React.FC = ({ children }: any) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [userData, setUserData] = useState<any>({})
  const data = useSelector((state: any) => state.login)

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('data')
    dispatch(setLogin(undefined))
    openNotification('success', 'Thành công', 'Đăng xuất thành công!')
  }, [])

  useEffect(() => {
    setUserData(data)
  }, [data])

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target='_blank' rel='noopener noreferrer' href='https://www.antgroup.com'>
          Đơn hàng
        </a>
      )
    },
    {
      key: '2',
      label: (
        <a target='_blank' rel='noopener noreferrer' href='https://www.aliyun.com'>
          Tài khoản
        </a>
      )
    },
    {
      key: '3',
      label: _.isEmpty(data.user) ? (
        <div
          onClick={() => {
            navigate(USER_PATH.LOGIN)
          }}
        >
          Đăng nhập
        </div>
      ) : (
        <div onClick={handleLogout}>Đăng xuất</div>
      )
    }
  ]

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle} className='flex items-center justify-between h-28 bg-baseBackground'>
        <div>
          <img className='w-28' src='/LOGO-WEBSHOP.jpg' alt='' />
        </div>
        <div className='flex items-center'>
          <div className='text-primary flex items-center justify-center uppercase font-semibold'>
            <h4
              className='cursor-pointer p-5 text-custom-xs hover:text-money transition duration-200'
              onClick={() => handleNavigate('/')} // Trang chủ
            >
              Trang chủ
            </h4>
            <h4
              className='cursor-pointer p-5 text-custom-xs hover:text-money transition duration-200'
              onClick={() => handleNavigate('/product')} // Trang sản phẩm
            >
              Sản phẩm
            </h4>
            <div
              className='cursor-pointer p-5 text-custom-xs hover:text-money transition duration-200 relative'
              onClick={() => handleNavigate('/cart')} // Trang sản phẩm
            >
              <div>Giỏ hàng</div>
              <div className='absolute top-7 right-1 text-while text-xs rounded-full w-5 h-5 flex items-center justify-center bg-money'>
                {10} {/* Biến số lượng sản phẩm trong giỏ */}
              </div>
            </div>
            <h4
              className='cursor-pointer p-5 text-custom-xs hover:text-money transition duration-200'
              onClick={() => handleNavigate('/help')} // Trợ giúp
            >
              Bài viết
            </h4>
            <h4 className='cursor-pointer p-5 text-custom-xs hover:text-money transition duration-200'>
              <Dropdown menu={{ items }} placement='bottomRight' arrow={{ pointAtCenter: true }}>
                <Avatar size={40} src={userData?.user?.avatar} icon={<UserOutlined />} />
              </Dropdown>
            </h4>
          </div>
        </div>
      </Header>
      <Content className='bg-baseBackground'>
        <div>{children}</div>
      </Content>
      <Footer className='flex items-center justify-between p-0'>
        <div className='bg-[#FFF5EE] text-primary w-1/2 h-96 p-12 flex items-center justify-center'>
          <div>
            <div>
              <h3 className='text-custom-xl font-semibold'>Địa chỉ</h3>
              <p className='text-custom-xs'>299 Trung Kính, Cầu Giấy, Hà Nội</p>
            </div>
            <div>
              <h3 className='text-custom-xl font-semibold'>Liên hệ</h3>
              <p className='text-custom-xs'>038.4609.456</p>
              <p className='text-custom-xs underline'>thesonshop@gmail.com</p>
            </div>
          </div>
        </div>
        <div className='bg-[#FFF5EE] text-primary w-1/2 h-96 p-12'>
          <div>
            <h1 className='text-custom-xl font-semibold mb-4'>Thông tin hỗ trợ</h1>
            <div className='w-[500px]'>
              <Form layout='vertical'>
                <Form.Item
                  name='phone'
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                  ]}
                >
                  <Input placeholder='Phone' />
                </Form.Item>
                <Form.Item
                  name='email'
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input placeholder='Email' />
                </Form.Item>
                <Form.Item>
                  <TextArea rows={4} placeholder='Nhập phản hồi' maxLength={6} />
                </Form.Item>

                <Form.Item>
                  <Button className='bg-[black]' type='primary' htmlType='submit'>
                    Gửi
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </Footer>
    </Layout>
  )
}

export default UserLayout
