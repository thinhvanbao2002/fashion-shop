import { Image, Select, InputNumber } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { productServices } from '../product/productApis'
import { formatPrice, openNotification, openNotificationError } from 'common/utils'
import RelatedProducts from 'features/admin/Product/components/RelatedProducts'
import { USER_PATH } from 'common/constants/paths'
import Comment from '../comment/Comment'

function DetailProductPage() {
  const [product, setProduct] = useState<any>({})
  const navigate = useNavigate()
  const [relatedProducts, setRelatedProducts] = useState<Array<any>>([])
  const [payload, setPayload] = useState<any>({
    page: 1,
    take: 999,
    brand: null
  })
  const [cartPayload, setCartPayload] = useState<any>({
    size: 'l',
    product_number: 1,
    product_id: null
  })
  const { id } = useParams()

  const getProductById = useCallback(async (id: any) => {
    try {
      const res = await productServices.getById(id)
      setProduct(res?.data)
    } catch (error) {
      console.log('🚀 ~ getProductById ~ error:', error)
    }
  }, [])

  const getProductsByCategory = useCallback(async (payload: any) => {
    try {
      const res = await productServices.get(payload)
      setRelatedProducts(res?.data)
    } catch (error) {
      console.log('🚀 ~ getProductById ~ error:', error)
    }
  }, [])

  const handleRelatedProductClick = useCallback(
    (productId: string) => {
      navigate(`${USER_PATH.PRODUCT_DETAIL}/${productId}`)
    },
    [navigate]
  )

  const handleSetCartPayload = (key: any, value: any) => {
    try {
      setCartPayload((prev: any) => ({
        ...prev,
        [key]: value
      }))
    } catch (error) {
      console.log('🚀 ~ handleSetCartPayload ~ error:', error)
    }
  }
  const handleAddToCart = useCallback(async (payload: any) => {
    try {
      const res = await productServices.addToCart(payload)
      if (res) {
        openNotification('success', 'Thành công', 'Thêm sản phẩm vào giỏ hàng thành công!')
      }
    } catch (error) {
      openNotificationError(error)
    }
  }, [])

  useEffect(() => {
    getProductById(id)
    window.scrollTo({
      top: 0, // Vị trí trên cùng
      behavior: 'smooth' // Cuộn mượt
    })
  }, [id, getProductById, handleRelatedProductClick])

  useEffect(() => {
    if (product?.category_id) {
      setPayload((prev: any) => ({
        ...prev,
        brand: product?.category_id
      }))
    }
  }, [product, handleRelatedProductClick])

  useEffect(() => {
    if (payload.brand) {
      getProductsByCategory(payload)
    }
  }, [payload])

  useEffect(() => {
    setCartPayload((prev: any) => ({
      ...prev,
      product_id: product?.id
    }))
  }, [product])

  return (
    <>
      <div className='w-full h-[50px] pl-20 pr-20'>
        <div className='w-full border-b-2 h-[50px] flex items-center justify-start text-custom-sm'>
          <span>Sản phẩm</span>
          <div className='border-r-2 border-border-basic ml-2 mr-2 w-[1px] h-[16px]'></div>
          <span>{product.category?.name}</span>
          <div className='border-r-2 border-border-basic ml-2 mr-2 w-[1px] h-[16px] '></div>
          <span className='font-semibold'>{product?.name}</span>
        </div>
      </div>
      <div className='w-full pl-20 pr-20 pt-10 pb-20 flex sm:flex-col md:flex-col lg:flex-row'>
        <div className='p-6 sm:w-full  md:w-full lg:w-[60%]'>
          <div className='w-full '>
            <Image width={'100%'} className='object-cover h-auto' src={product.image} />
          </div>
          <div className='flex mt-2 overflow-x-scroll'>
            {product.product_photo &&
              product?.product_photo.length &&
              product?.product_photo.map((p: any) => (
                <Image width={150} height={150} className='object-cover p-1' src={p?.url} />
              ))}
          </div>
        </div>
        <div className='w-full p-6 lg:w-[40%]'>
          <div>
            <h2 className='uppercase text-custom-xl font-semibold'>{product?.name}</h2>
          </div>
          <div className='flex items-center justify-between text-custom-sm mt-4'>
            <div className='flex'>
              <span>Mã sản phẩm:</span>
              <h3 className='font-semibold ml-2'>{product?.product_code}</h3>
            </div>
            <div className='flex'>
              <span>Tình trạng:</span>
              <h3 className='font-semibold ml-2'>Còn hàng</h3>
            </div>
          </div>
          <div className='mt-6'>
            <h2 className='font-extrabold text-custom-xl text-money'>{formatPrice(product.price)} VND</h2>
          </div>
          <div className='w-full border-t-2 border-dashed mt-6'></div>
          <div className='mt-5'>
            <p className='text-custom-xs text-justify'>{product.introduce}</p>
          </div>
          <div className='w-full border-t-2 border-dashed mt-6'></div>
          <div className='flex items-center justify-between text-custom-sm mt-6'>
            <div>
              <div className='flex flex-col'>
                <span>SIZE</span>
                <Select
                  defaultValue='l'
                  style={{ width: 180 }}
                  onChange={(value) => handleSetCartPayload('size', value)}
                  options={[
                    { value: 's', label: 'S' },
                    { value: 'm', label: 'M' },
                    { value: 'l', label: 'L' },
                    { value: 'xl', label: 'XL' },
                    { value: '2xl', label: '2XL' },
                    { value: '3xl', label: '3XL' }
                  ]}
                />
              </div>
            </div>
            <div>
              <div className='flex flex-col'>
                <span>SỐ LƯỢNG</span>
                <InputNumber
                  min={1}
                  defaultValue={1}
                  style={{ width: 180 }}
                  onChange={(value) => handleSetCartPayload('product_number', value)}
                />
              </div>
            </div>
          </div>
          <div className='w-full border-t-2 border-dashed mt-6'></div>
          <div className='mt-10'>
            <div>
              <div>
                <button
                  onClick={() => handleAddToCart(cartPayload)}
                  className='uppercase w-full p-5 bg-black text-while text-custom-xl rounded-lg shadow-xl hover:bg-money'
                >
                  thêm vào giỏ hàng
                </button>
              </div>
            </div>
            {/* <div>
              <button className='mt-6 uppercase w-full p-5 bg-money text-while text-custom-xl rounded-lg shadow-xl'>
                thanh toán
              </button>
            </div> */}
          </div>
        </div>
      </div>
      <div className='mb-10'>
        <RelatedProducts productList={relatedProducts} handleClick={handleRelatedProductClick} />
      </div>
      <div className='mt-20'>
        {id && <Comment id={Number(id)} reviews={product.product_reviews} getProduct={getProductById} />}
      </div>
    </>
  )
}

export default DetailProductPage
