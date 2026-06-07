/* eslint-disable @typescript-eslint/no-unused-vars */
import { Carousel, Button } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { productServices } from '../product/productApis'
import { homeServices } from './homeApis'
import CardComponent from 'common/components/cart/Cart.tsx'
import { useNavigate } from 'react-router'
import { USER_PATH } from 'common/constants/paths'
import { ShoppingCartOutlined, SafetyCertificateOutlined, GiftOutlined, TruckOutlined } from '@ant-design/icons'

interface urlBackground {
  url: string
}
const contentStyle: React.CSSProperties = {
  height: '600px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}

const backGrounds: Array<urlBackground> = [
  {
    url: 'https://hongnhat.com.vn/wp-content/uploads/2022/10/BANNER-1.jpg'
  },
  {
    url: 'https://cdn.gokisoft.com/uploads/stores/97/2024/01/5.jpg'
  }
]

function HomePage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<any>([])
  const [categories, setCategories] = useState<any>([])
  const payload = {
    page: 1,
    take: 10,
    q: '',
    to_date: '',
    from_date: ''
  }

  const handleGetProducts = useCallback(async (payload: any) => {
    try {
      const res = await productServices.get(payload)
      setProducts(res.data)
    } catch (error) {
      console.log('🚀 ~ handleGetProducts ~ error:', error)
    }
  }, [])

  const handleGetCategory = useCallback(async (payload: any) => {
    try {
      const res = await homeServices.getCategory(payload)
      setCategories(res.data)
    } catch (error) {
      console.log('🚀 ~ handleGetCategory ~ error:', error)
    }
  }, [])

  useEffect(() => {
    handleGetProducts(payload)
    handleGetCategory(payload)
  }, [])

  return (
    <>
      {/* CAROUSEL BANNER */}
      <Carousel className='h-[500px]' autoplay effect='fade'>
        {backGrounds.map((item, index) => (
          <div key={index}>
            <div style={{ ...contentStyle, backgroundImage: `url(${item.url})`, height: '500px' }} className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-black/30 to-black/10 flex flex-col items-center justify-center'>
                <h1 className='text-4xl font-bold text-white mb-4'>TaoBao shop</h1>
                <p className='text-lg text-white mb-6'>Thời trang chất lượng cao với giá tốt nhất</p>
                <Button
                  size='large'
                  className='bg-[#FFA500] text-white border-none px-8 hover:bg-[#FF9500]'
                  onClick={() => navigate(USER_PATH.PRODUCT)}
                >
                  Khám phá sản phẩm
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* SERVICE BENEFITS */}
      <div className='bg-white py-8'>
        <div className='max-w-7xl mx-auto px-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <div className='text-center'>
              <TruckOutlined className='text-3xl text-[#FFA500] mb-3 block' />
              <h3 className='font-semibold text-gray-800 text-sm'>Miễn phí vận chuyển</h3>
              <p className='text-xs text-gray-600 mt-1'>Từ 200.000 VNĐ</p>
            </div>
            <div className='text-center'>
              <SafetyCertificateOutlined className='text-3xl text-[#FFA500] mb-3 block' />
              <h3 className='font-semibold text-gray-800 text-sm'>Bảo hành 30 ngày</h3>
              <p className='text-xs text-gray-600 mt-1'>Hoàn tiền 100%</p>
            </div>
            <div className='text-center'>
              <GiftOutlined className='text-3xl text-[#FFA500] mb-3 block' />
              <h3 className='font-semibold text-gray-800 text-sm'>Quà tặng hàng ngày</h3>
              <p className='text-xs text-gray-600 mt-1'>Khuyến mãi liên tục</p>
            </div>
            <div className='text-center'>
              <ShoppingCartOutlined className='text-3xl text-[#FFA500] mb-3 block' />
              <h3 className='font-semibold text-gray-800 text-sm'>Thanh toán an toàn</h3>
              <p className='text-xs text-gray-600 mt-1'>Nhiều phương thức</p>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY SECTION */}
      <div className='bg-gray-50 py-6'>
        <div className='max-w-7xl mx-auto px-8'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>Danh mục</h2>
          <div className='flex flex-wrap gap-3 overflow-x-auto pb-2'>
            {categories &&
              categories.length > 0 &&
              categories.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(USER_PATH.PRODUCT, { state: { category_id: item.id } })
                  }}
                  className='px-5 py-2 bg-white border border-[#FFA500] text-[#FFA500] rounded-full text-sm font-semibold hover:bg-[#FFA500] hover:text-white transition-all duration-200 whitespace-nowrap'
                >
                  {item?.name}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* MAIN PRODUCT SECTION */}
      <div className='bg-white py-10'>
        <div className='max-w-7xl mx-auto px-8'>
          <div className='flex items-center gap-3 mb-8'>
            <h2 className='text-2xl font-bold text-gray-800'>Sản phẩm nổi bật</h2>
            <div className='h-1 w-12 bg-[#FFA500] rounded'></div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
            {products &&
              products.length &&
              products.map((item: any, index: number) => <CardComponent key={index} data={item} />)}
          </div>

          <div className='text-center mt-10'>
            <Button
              size='large'
              className='bg-[#FFA500] text-white border-none px-10 hover:bg-[#FF9500]'
              onClick={() => navigate(USER_PATH.PRODUCT)}
            >
              Xem tất cả
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage
