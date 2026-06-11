import {
  AppstoreOutlined,
  CheckOutlined,
  DownOutlined,
  ReloadOutlined,
  TagsOutlined,
  WalletOutlined
} from '@ant-design/icons'
import { Layout, Pagination, Spin } from 'antd'
import CardComponent from 'common/components/cart/Cart'
import NodataComponent from 'common/components/Nodata/NoData'
import { formatPrice } from 'common/utils'
import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { homeServices } from '../home/homeApis'
import { PRODUCT_VALUES } from './product.constants.'
import { productServices } from './productApis'

const { Sider, Content } = Layout

const productPriceListOptions = [
  { label: `< ${formatPrice(200000)}`, range: [0, 200000] },
  { label: `${formatPrice(200000)} - ${formatPrice(500000)}`, range: [200000, 500000] },
  { label: `${formatPrice(500000)} - ${formatPrice(700000)}`, range: [500000, 700000] },
  { label: `${formatPrice(700000)} - ${formatPrice(1000000)}`, range: [700000, 1000000] },
  { label: `> ${formatPrice(1000000)}`, range: [1000000, 100000000] }
]

function ProductPage() {
  const [isProductTypesOpen, setIsProductTypesOpen] = useState<boolean>(true)
  const [isProductPriceOpen, setIsPriceOpen] = useState<boolean>(true)
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [products, setProducts] = useState<any>([])
  const [categories, setCategories] = useState<Array<any>>([])
  const [itemCount, setItemCount] = useState<number>(0)
  const location = useLocation()
  const { state } = location || {}
  const initialBrand = state?.category_id || null
  const [payload, setPayload] = useState<any>({
    page: 1,
    take: 15,
    q: '',
    to_date: '',
    from_date: '',
    status: null,
    price_range: null,
    brand: initialBrand,
    product_type: null
  })

  const handleGetProduct = useCallback(async (payload: any) => {
    try {
      setIsLoading(true)
      const res: any = await productServices.get(payload)
      setItemCount(res?.meta?.item_count || res?.data?.meta?.item_count || 0)
      setProducts(res?.data)
      setIsLoading(false)
    } catch (error) {
      console.error('🚀 ~ handleGetProduct ~ error:', error)
      setIsLoading(false)
    }
  }, [])

  const handleGetcategory = useCallback(async () => {
    try {
      const res = await homeServices.getCategory()
      setCategories(res?.data)
    } catch (error) {
      console.error('🚀 ~ handleGetcategory ~ error:', error)
    }
  }, [])

  const productTypeListOptions = Object.entries(PRODUCT_VALUES).map(([value, { text }]) => ({
    label: text,
    value
  }))

  const toggleMenu = (key: string) => {
    switch (key) {
      case 'status':
        setIsProductTypesOpen(!isProductTypesOpen)
        break
      case 'price':
        setIsPriceOpen(!isProductPriceOpen)
        break
      case 'category':
        setIsCategoryOpen(!isCategoryOpen)
        break
      default:
        break
    }
  }

  const handleFilterChange = (key: string, value: any) => {
    setPayload((prev: any) => ({
      ...prev,
      page: key === 'page' ? value : 1,
      ...(key === 'page' ? {} : { [key]: value })
    }))
  }

  const handleResetFilters = () => {
    setPayload((prev: any) => ({
      ...prev,
      page: 1,
      price_range: null,
      brand: null,
      product_type: null
    }))
  }

  const isPriceRangeSelected = (range: number[]) => JSON.stringify(payload.price_range) === JSON.stringify(range)

  const activeFilterCount = [payload.product_type, payload.price_range, payload.brand].filter(Boolean).length

  useEffect(() => {
    handleGetProduct(payload)
  }, [payload, handleGetProduct])

  useEffect(() => {
    handleGetcategory()
  }, [handleGetcategory])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <div className='min-h-screen bg-gray-50'>
        <Layout className='!bg-gray-50' style={{ backgroundColor: '#f9fafb' }}>
          <Sider
            width={286}
            breakpoint='lg'
            collapsedWidth={0}
            className='!bg-gray-50'
            style={{ backgroundColor: '#f9fafb' }}
          >
            <aside className='sticky top-5 m-5 overflow-hidden rounded-3xl bg-white shadow-[0_16px_50px_-34px_rgba(15,23,42,0.35)]'>
              {/* <div className='bg-gradient-to-r from-[#FF9500] to-[#FFA500] px-5 py-5 text-white'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-white/20'>
                      <FilterOutlined />
                    </div>
                    <div>
                      <h2 className='font-bold'>Bộ lọc sản phẩm</h2>
                      <p className='mt-0.5 text-xs text-orange-50'>Tìm sản phẩm phù hợp</p>
                    </div>
                  </div>
                  {activeFilterCount > 0 && (
                    <span className='flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-2 text-xs font-bold text-[#FF9500]'>
                      {activeFilterCount}
                    </span>
                  )}
                </div>
              </div> */}

              <div className='max-h-[calc(100vh-180px)] overflow-y-auto px-4 py-4'>
                <div className='rounded-2xl bg-gray-50/80 p-2'>
                  <button
                    onClick={() => toggleMenu('status')}
                    className='group flex w-full items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-white'
                  >
                    <span className='flex items-center gap-2.5 text-sm font-bold text-gray-800 group-hover:text-[#FFA500]'>
                      <TagsOutlined className='text-[#FFA500]' />
                      Trạng thái
                    </span>
                    <DownOutlined
                      className={`text-xs text-[#FFA500] transition-transform duration-300 ${
                        isProductTypesOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isProductTypesOpen && (
                    <ul className='space-y-1 px-1 pb-2'>
                      {productTypeListOptions.map((option) => {
                        const isSelected = payload.product_type === option.value

                        return (
                          <li key={option.value}>
                            <button
                              onClick={() => handleFilterChange('product_type', isSelected ? null : option.value)}
                              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                                isSelected
                                  ? 'bg-orange-50 font-bold text-[#FF9500]'
                                  : 'text-gray-600 hover:bg-white hover:text-[#FFA500]'
                              }`}
                            >
                              {option.label}
                              {isSelected && <CheckOutlined className='text-xs' />}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>

                <div className='my-3 rounded-2xl bg-gray-50/80 p-2'>
                  <button
                    onClick={() => toggleMenu('price')}
                    className='group flex w-full items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-white'
                  >
                    <span className='flex items-center gap-2.5 text-sm font-bold text-gray-800 group-hover:text-[#FFA500]'>
                      <WalletOutlined className='text-[#FFA500]' />
                      Khoảng giá
                    </span>
                    <DownOutlined
                      className={`text-xs text-[#FFA500] transition-transform duration-300 ${
                        isProductPriceOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isProductPriceOpen && (
                    <ul className='space-y-1 px-1 pb-2'>
                      {productPriceListOptions.map((option, index) => {
                        const isSelected = isPriceRangeSelected(option.range)

                        return (
                          <li key={index}>
                            <button
                              onClick={() => handleFilterChange('price_range', isSelected ? null : option.range)}
                              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                                isSelected
                                  ? 'bg-orange-50 font-bold text-[#FF9500]'
                                  : 'text-gray-600 hover:bg-white hover:text-[#FFA500]'
                              }`}
                            >
                              {option.label} VND
                              {isSelected && <CheckOutlined className='text-xs' />}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>

                <div className='rounded-2xl bg-gray-50/80 p-2'>
                  <button
                    onClick={() => toggleMenu('category')}
                    className='group flex w-full items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-white'
                  >
                    <span className='flex items-center gap-2.5 text-sm font-bold text-gray-800 group-hover:text-[#FFA500]'>
                      <AppstoreOutlined className='text-[#FFA500]' />
                      Danh mục
                    </span>
                    <DownOutlined
                      className={`text-xs text-[#FFA500] transition-transform duration-300 ${
                        isCategoryOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isCategoryOpen && (
                    <ul className='space-y-1 px-1 pb-2'>
                      {categories.map((category) => {
                        const isSelected = payload.brand === category.id

                        return (
                          <li key={category.id}>
                            <button
                              onClick={() => handleFilterChange('brand', isSelected ? null : category.id)}
                              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                                isSelected
                                  ? 'bg-orange-50 font-bold text-[#FF9500]'
                                  : 'text-gray-600 hover:bg-white hover:text-[#FFA500]'
                              }`}
                            >
                              {category.name}
                              {isSelected && <CheckOutlined className='text-xs' />}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>

                <button
                  type='button'
                  disabled={activeFilterCount === 0}
                  onClick={handleResetFilters}
                  className='mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-50 px-4 py-3 text-sm font-bold text-[#FF9500] transition-colors hover:bg-orange-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300'
                >
                  <ReloadOutlined />
                  Đặt lại bộ lọc
                </button>
              </div>
            </aside>
          </Sider>

          {products && products.length ? (
            <Spin wrapperClassName='wrapper-spin' spinning={isLoading}>
              <Content className='!bg-gray-50 px-8 py-8'>
                {products && products.length && (
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8'>
                    {products.map((item: any, index: number) => (
                      <CardComponent key={index} data={item} />
                    ))}
                  </div>
                )}
                <div className='mt-8 flex justify-center'>
                  <Pagination
                    current={payload.page}
                    total={itemCount}
                    defaultPageSize={payload.take}
                    onChange={(page) => handleFilterChange('page', page)}
                    size='small'
                    itemRender={(page, type, originalElement) => {
                      if (type === 'page') {
                        return (
                          <a
                            className={`px-2 py-1 rounded text-sm transition-all ${
                              page === payload.page ? '!bg-[#FFA500] !text-white' : 'text-gray-800 hover:text-[#FFA500]'
                            }`}
                          >
                            {page}
                          </a>
                        )
                      }
                      return originalElement
                    }}
                  />
                </div>
              </Content>
            </Spin>
          ) : (
            <NodataComponent />
          )}
        </Layout>
      </div>
    </>
  )
}

export default ProductPage
