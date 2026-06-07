import {
  FacebookOutlined,
  HeartOutlined,
  InstagramOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  TwitterOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Avatar, Badge, Button, Dropdown, Input, Layout } from 'antd'
import { MenuProps } from 'antd/lib'
import { USER_PATH } from 'common/constants/paths'
import { formatPrice, openNotification } from 'common/utils'
import AccountUser from 'features/customer/account/components/Account'
import { productServices } from 'features/customer/product/productApis'
import _ from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setLogin } from 'redux/slice/login.slice'

const { Header, Footer, Content } = Layout

const layoutStyle = {
  overflow: 'hidden',
  width: '100vw',
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column'
}

const UserLayout: React.FC = ({ children }: any) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [userData, setUserData] = useState<any>({})
  const data = useSelector((state: any) => state.login)
  const [modalAccountIsvisible, setModalAccountIsVisible] = useState<boolean>(false)
  const [cartCount] = useState<number>(0)
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchProducts, setSearchProducts] = useState<Array<any>>([])
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [isSearching, setIsSearching] = useState<boolean>(false)

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('data')
    dispatch(setLogin(undefined))
    openNotification('success', 'Thành công', 'Đăng xuất thành công!')
    handleNavigate('/')
  }, [])

  const handleCloseModal = () => {
    setModalAccountIsVisible(false)
  }

  const handleWishlistClick = () => {
    navigate('/wishlist')
  }

  const handleProductClick = (productId: string | number) => {
    setSearchValue('')
    setSearchProducts([])
    setIsSearchOpen(false)
    navigate(`${USER_PATH.PRODUCT_DETAIL}/${productId}`)
  }

  useEffect(() => {
    setUserData(data)
  }, [data])

  useEffect(() => {
    const keyword = searchValue.trim()

    if (!keyword) {
      setSearchProducts([])
      setIsSearchOpen(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsSearching(true)
        const res: any = await productServices.get({ page: 1, q: keyword } as any)
        setSearchProducts(Array.isArray(res?.data) ? res.data.slice(0, 6) : [])
        setIsSearchOpen(true)
      } catch {
        setSearchProducts([])
        setIsSearchOpen(false)
      } finally {
        setIsSearching(false)
      }
    }, 350)

    return () => clearTimeout(timeoutId)
  }, [searchValue])

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <Link to='/order/history'>Đơn hàng</Link>
    },
    {
      key: '2',
      label: (
        <p
          rel='noopener noreferrer'
          onClick={() => {
            setModalAccountIsVisible(!modalAccountIsvisible)
          }}
        >
          Tài khoản
        </p>
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
      {/* TOP BANNER */}
      <div className='w-full bg-[#FFA500] text-white text-center py-2 text-xs'>
        <p>Miễn phí vận chuyển cho đơn hàng từ 200.000 VNĐ | 🎁 Khuyến mãi hàng ngày</p>
      </div>

      <Header className='!bg-white !px-8 shadow-sm' style={{ backgroundColor: '#ffffff', padding: '0 32px' }}>
        <div className='flex items-center justify-between h-full'>
          {/* LOGO */}
          <div className='flex-shrink-0 cursor-pointer' onClick={() => handleNavigate('/')}>
            <img className='h-16 w-auto' src='/LOGO-WEBSHOP.jpg' alt='Logo' />
          </div>

          {/* NAV MENU */}
          <div className='flex items-center gap-8 !text-gray-800 font-semibold text-sm'>
            <h4
              className='cursor-pointer !text-gray-800 hover:text-[#FFA500] transition duration-200'
              onClick={() => handleNavigate('/')}
            >
              Trang chủ
            </h4>
            <h4
              className='cursor-pointer !text-gray-800 hover:text-[#FFA500] transition duration-200'
              onClick={() => handleNavigate('/product')}
            >
              Sản phẩm
            </h4>
            <h4
              className='cursor-pointer !text-gray-800 hover:text-[#FFA500] transition duration-200'
              onClick={() => handleNavigate('/blog')}
            >
              Blog
            </h4>
            <h4
              className='cursor-pointer !text-gray-800 hover:text-[#FFA500] transition duration-200'
              onClick={() => handleNavigate('/about')}
            >
              Về chúng tôi
            </h4>
          </div>

          {/* RIGHT ICONS */}
          <div className='flex items-center gap-6'>
            {/* PRODUCT SEARCH */}
            <div className='relative w-[360px] leading-normal'>
              <Input
                allowClear
                value={searchValue}
                placeholder='Tìm kiếm sản phẩm'
                prefix={<SearchOutlined className='!text-gray-400' />}
                onChange={(event) => setSearchValue(event.target.value)}
                onFocus={() => {
                  if (searchValue.trim()) setIsSearchOpen(true)
                }}
                onPressEnter={() => {
                  if (searchProducts[0]?.id) handleProductClick(searchProducts[0].id)
                }}
                className='h-10 rounded-full px-3'
              />

              {isSearchOpen && searchValue.trim() && (
                <div
                  className='absolute left-0 top-[46px] z-50 w-full overflow-hidden rounded-lg border border-gray-100 !bg-white shadow-[0_18px_45px_-18px_rgba(15,23,42,0.35)]'
                  style={{ backgroundColor: '#ffffff' }}
                >
                  {isSearching ? (
                    <div className='!bg-white px-4 py-3 text-sm leading-normal text-gray-500'>Đang tìm kiếm...</div>
                  ) : searchProducts.length ? (
                    <div className='max-h-[360px] overflow-y-auto !bg-white'>
                      {searchProducts.map((product: any) => (
                        <button
                          key={product.id}
                          type='button'
                          className='flex w-full items-center gap-3 border-0 !bg-white px-4 py-3 text-left leading-normal transition hover:!bg-orange-50 focus:!bg-orange-50 focus:outline-none'
                          onClick={() => handleProductClick(product.id)}
                        >
                          <img
                            src={
                              product.image ||
                              'https://bizweb.dktcdn.net/100/415/697/products/ak058.png?v=1701405312903'
                            }
                            alt={product.name || 'Sản phẩm'}
                            className='h-14 w-14 flex-shrink-0 rounded-md bg-gray-100 object-cover'
                          />
                          <div className='min-w-0 flex-1'>
                            <p className='line-clamp-2 text-sm font-semibold leading-5 text-gray-800'>{product.name}</p>
                            <p className='mt-1 text-sm font-bold leading-5 text-[#FFA500]'>
                              {formatPrice(product.price)} VND
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className='!bg-white px-4 py-3 text-sm leading-normal text-gray-500'>
                      Không tìm thấy sản phẩm phù hợp
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* WISHLIST */}
            <div
              className='cursor-pointer text-lg text-primary hover:text-[#FFA500] transition duration-200'
              onClick={handleWishlistClick}
            >
              <HeartOutlined style={{ fontSize: '20px' }} />
            </div>

            {/* CART */}
            <div
              className='cursor-pointer text-lg text-primary hover:text-[#FFA500] transition duration-200 relative'
              onClick={() => handleNavigate('/cart')}
            >
              <Badge count={cartCount} showZero={false}>
                <ShoppingCartOutlined style={{ fontSize: '20px' }} />
              </Badge>
            </div>

            {/* AVATAR & MENU */}
            <Dropdown menu={{ items }} placement='bottomRight' arrow={{ pointAtCenter: true }}>
              <Avatar
                size={40}
                src={userData?.user?.avatar}
                icon={<UserOutlined />}
                className='cursor-pointer hover:opacity-80 transition'
              />
            </Dropdown>
          </div>
        </div>
      </Header>

      {/* CONTENT */}
      <Content className='bg-baseBackground'>
        <div>{children}</div>
      </Content>

      {/* FOOTER */}
      <Footer className='!bg-white !text-gray-800 !p-0'>
        <div className='bg-white text-gray-800'>
          {/* FOOTER TOP */}
          <div className='grid grid-cols-5 gap-8 px-12 py-16 border-b border-gray-300 !text-gray-800'>
            {/* ABOUT */}
            <div>
              <h4 className='text-base font-semibold mb-4 !text-gray-800'>Về TaoBao shop</h4>
              <ul className='space-y-2 text-xs !text-gray-600'>
                <li>
                  <a href='#' className='!text-gray-600 hover:!text-[#FFA500] transition'>
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a href='#' className='!text-gray-600 hover:!text-[#FFA500] transition'>
                    Câu chuyện thương hiệu
                  </a>
                </li>
                <li>
                  <a href='#' className='!text-gray-600 hover:!text-[#FFA500] transition'>
                    Tin tức & Blog
                  </a>
                </li>
                <li>
                  <a href='#' className='!text-gray-600 hover:!text-[#FFA500] transition'>
                    Cơ hội việc làm
                  </a>
                </li>
              </ul>
            </div>

            {/* POLICIES */}
            <div>
              <h4 className='text-base font-semibold mb-4 !text-gray-800'>Chính sách & Quy định</h4>
              <ul className='space-y-2 text-xs !text-gray-600'>
                <li>
                  <a href='#' className='!text-gray-600 hover:!text-[#FFA500] transition'>
                    Chính sách bán hàng
                  </a>
                </li>
                <li>
                  <a href='#' className='!text-gray-600 hover:!text-[#FFA500] transition'>
                    Chính sách đổi trả
                  </a>
                </li>
                <li>
                  <a href='#' className='!text-gray-600 hover:!text-[#FFA500] transition'>
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a href='#' className='!text-gray-600 hover:!text-[#FFA500] transition'>
                    Điều khoản sử dụng
                  </a>
                </li>
              </ul>
            </div>

            {/* SUPPORT */}
            <div>
              <h4 className='text-base font-semibold mb-4 !text-gray-800'>Hỗ trợ khách hàng</h4>
              <ul className='space-y-2 text-xs !text-gray-600'>
                <li>
                  <a href='#' className='!text-gray-600 hover:!text-[#FFA500] transition'>
                    Câu hỏi thường gặp
                  </a>
                </li>
                <li>
                  <a href='#' className='!text-gray-600 hover:!text-[#FFA500] transition'>
                    Hướng dẫn thanh toán
                  </a>
                </li>
                <li>
                  <a href='#' className='!text-gray-600 hover:!text-[#FFA500] transition'>
                    Hướng dẫn vận chuyển
                  </a>
                </li>
                <li>
                  <a href='#' className='!text-gray-600 hover:!text-[#FFA500] transition'>
                    Liên hệ hỗ trợ
                  </a>
                </li>
              </ul>
            </div>

            {/* CONTACT */}
            <div>
              <h4 className='text-base font-semibold mb-4 !text-gray-800'>Liên hệ</h4>
              <ul className='space-y-3 text-xs !text-gray-600'>
                <li>
                  <p className='font-semibold !text-gray-800'>Địa chỉ:</p>
                  <p className='!text-gray-600'>299 Trung Kính, Cầu Giấy, Hà Nội</p>
                </li>
                <li>
                  <p className='font-semibold !text-gray-800'>Hotline:</p>
                  <p className='!text-gray-600 hover:!text-[#FFA500] transition cursor-pointer'>038.4609.456</p>
                </li>
                <li>
                  <p className='font-semibold !text-gray-800'>Email:</p>
                  <p className='!text-gray-600 hover:!text-[#FFA500] transition cursor-pointer'>thesonshop@gmail.com</p>
                </li>
              </ul>
            </div>

            {/* NEWSLETTER */}
            <div>
              <h4 className='text-base font-semibold mb-4 !text-gray-800'>Đăng ký nhận tin</h4>
              <p className='text-xs !text-gray-600 mb-3'>Nhận thông tin khuyến mãi mới nhất từ chúng tôi</p>
              <Input
                placeholder='Email của bạn'
                size='small'
                className='mb-2'
                suffix={<SearchOutlined className='!text-gray-400' />}
              />
              <Button className='w-full bg-[#FFA500] !text-white border-none hover:bg-[#FF9500]' size='small'>
                Đăng ký
              </Button>
            </div>
          </div>

          {/* FOOTER MIDDLE - PAYMENT & SECURITY */}
          <div className='px-12 py-8 border-b border-gray-300 !text-gray-800'>
            <div className='grid grid-cols-2 gap-8'>
              <div>
                <h5 className='text-sm font-semibold mb-3 !text-gray-800'>Phương thức thanh toán</h5>
                <div className='flex gap-3'>
                  <span className='text-xs bg-gray-200 px-3 py-1 rounded !text-gray-700'>Thẻ tín dụng</span>
                  <span className='text-xs bg-gray-200 px-3 py-1 rounded !text-gray-700'>ZaloPay</span>
                  <span className='text-xs bg-gray-200 px-3 py-1 rounded !text-gray-700'>Chuyển khoản</span>
                  <span className='text-xs bg-gray-200 px-3 py-1 rounded !text-gray-700'>Tiền mặt</span>
                </div>
              </div>
              <div>
                <h5 className='text-sm font-semibold mb-3 !text-gray-800'>Theo dõi chúng tôi</h5>
                <div className='flex gap-4'>
                  <a href='#' className='text-lg !text-gray-800 hover:!text-[#FFA500] transition'>
                    <FacebookOutlined />
                  </a>
                  <a href='#' className='text-lg !text-gray-800 hover:!text-[#FFA500] transition'>
                    <InstagramOutlined />
                  </a>
                  <a href='#' className='text-lg !text-gray-800 hover:!text-[#FFA500] transition'>
                    <TwitterOutlined />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER BOTTOM */}
          <div className='px-12 py-6 bg-gray-100 text-center text-xs !text-gray-600'>
            <p>
              &copy; 2024 <span className='!text-gray-800 font-semibold'>TaoBao shop</span>. All rights reserved. |
              Designed with ❤️
            </p>
          </div>
        </div>
      </Footer>

      <AccountUser openModal={modalAccountIsvisible} titleModal='Thông tin tài khoản' onClose={handleCloseModal} />
    </Layout>
  )
}

export default UserLayout
