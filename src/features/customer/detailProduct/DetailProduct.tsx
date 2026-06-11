import { Select, InputNumber } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { productServices } from '../product/productApis'
import { formatPrice, openNotification, openNotificationError } from 'common/utils'
import CardComponent from 'common/components/cart/Cart'
import { USER_PATH } from 'common/constants/paths'
import Comment from '../comment/Comment'

function DetailProductPage() {
  const [product, setProduct] = useState<any>({})
  const [selectedImage, setSelectedImage] = useState<string>('')
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
  const stockQuantity = Number(product?.stock_quantity ?? product?.quantity ?? 0)
  const selectedQuantity = Number(cartPayload.product_number || 0)
  const isOutOfStock = stockQuantity <= 0
  const isQuantityInvalid = selectedQuantity > stockQuantity
  const isAddToCartDisabled = isOutOfStock || isQuantityInvalid

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

  const handleQuantityChange = (value: number | null) => {
    handleSetCartPayload('product_number', value)

    if (value && value > stockQuantity) {
      openNotification('warning', 'Thông báo', 'Số lượng trong kho không đủ!')
    }
  }

  const handleAddToCart = useCallback(
    async (payload: any) => {
      if (isOutOfStock) {
        openNotification('warning', 'Thông báo', 'Sản phẩm đã hết hàng!')
        return
      }

      if (Number(payload?.product_number || 0) > stockQuantity) {
        openNotification('warning', 'Thông báo', 'Số lượng trong kho không đủ!')
        return
      }

      try {
        const res = await productServices.addToCart(payload)
        if (res) {
          openNotification('success', 'Thành công', 'Thêm sản phẩm vào giỏ hàng thành công!')
        }
      } catch (error) {
        openNotificationError(error)
      }
    },
    [isOutOfStock, stockQuantity]
  )

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
    setSelectedImage(product?.image || '')
  }, [product])

  return (
    <>
      {/* BREADCRUMB */}
      <div className='bg-white border-b border-gray-200 px-8 py-4'>
        <div className='max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-600'>
          <span className='cursor-pointer hover:text-[#FFA500]'>Sản phẩm</span>
          <span className='text-gray-400'>/</span>
          <span className='cursor-pointer hover:text-[#FFA500]'>{product.category?.name}</span>
          <span className='text-gray-400'>/</span>
          <span className='text-gray-900 font-semibold'>{product?.name}</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className='min-h-screen bg-gray-50 py-12 px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-lg shadow-sm p-8'>
            {/* LEFT SECTION - IMAGES */}
            <div>
              {/* MAIN IMAGE */}
              <div className='w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4'>
                <img
                  src={selectedImage || product.image}
                  alt={product?.name}
                  className='w-full h-full object-cover object-center cursor-pointer transition-transform duration-300 hover:scale-105'
                />
              </div>

              {/* THUMBNAIL GALLERY */}
              {(product.image || (product.product_photo && product?.product_photo.length > 0)) && (
                <div className='flex gap-2 overflow-x-auto pb-2'>
                  {/* ORIGINAL IMAGE */}
                  {product.image && (
                    <img
                      src={product.image}
                      alt='Ảnh gốc'
                      onClick={() => setSelectedImage(product.image)}
                      className={`w-20 h-20 rounded-lg object-cover cursor-pointer transition-all border-2 flex-shrink-0 ${
                        selectedImage === product.image
                          ? 'border-[#FFA500] opacity-100'
                          : 'border-gray-200 opacity-60 hover:opacity-100'
                      }`}
                    />
                  )}
                  {/* ADDITIONAL PHOTOS */}
                  {product?.product_photo?.map((p: any, index: number) => (
                    <img
                      key={index}
                      src={p?.url}
                      alt={`Product ${index}`}
                      onClick={() => setSelectedImage(p?.url)}
                      className={`w-20 h-20 rounded-lg object-cover cursor-pointer transition-all border-2 flex-shrink-0 ${
                        selectedImage === p?.url
                          ? 'border-[#FFA500] opacity-100'
                          : 'border-gray-200 opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT SECTION - DETAILS */}
            <div className='flex flex-col'>
              {/* PRODUCT NAME */}
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>{product?.name}</h1>

              {/* CATEGORY & STATUS */}
              <div className='flex items-center gap-4 mb-6 pb-6 border-b border-gray-200'>
                <div>
                  <p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>Danh mục</p>
                  <p className='text-sm font-semibold text-gray-800'>{product.category?.name}</p>
                </div>
                <div className='w-px h-12 bg-gray-200'></div>
                <div>
                  <p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>Tình trạng</p>
                  <p className={`text-sm font-semibold ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                    {isOutOfStock ? 'Hết hàng' : `Còn ${stockQuantity} sản phẩm`}
                  </p>
                </div>
                <div className='w-px h-12 bg-gray-200'></div>
                <div>
                  <p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>Mã sản phẩm</p>
                  <p className='text-sm font-semibold text-gray-800'>{product?.product_code}</p>
                </div>
              </div>

              {/* PRICE */}
              <div className='mb-6 pb-6 border-b border-gray-200'>
                <p className='text-4xl font-bold text-[#FFA500]'>{formatPrice(product.price)} VND</p>
              </div>

              {/* DESCRIPTION */}
              {product.introduce && (
                <div className='mb-6 pb-6 border-b border-gray-200'>
                  <p className='whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-700'>{product.introduce}</p>
                </div>
              )}

              {/* SIZE & QUANTITY */}
              <div className='grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200'>
                <div>
                  <label className='block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2'>Kích cỡ</label>
                  <Select
                    defaultValue='l'
                    className='w-full'
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
                <div>
                  <label className='block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2'>Số lượng</label>
                  <InputNumber
                    min={1}
                    max={stockQuantity || 1}
                    defaultValue={1}
                    disabled={isOutOfStock}
                    status={isQuantityInvalid ? 'error' : undefined}
                    className='w-full'
                    onChange={handleQuantityChange}
                  />
                  {isQuantityInvalid && (
                    <p className='mt-2 text-xs font-semibold text-red-500'>Số lượng trong kho không đủ</p>
                  )}
                </div>
              </div>

              {/* ADD TO CART BUTTON */}
              <button
                onClick={() => handleAddToCart(cartPayload)}
                disabled={isAddToCartDisabled}
                className='w-full bg-[#FFA500] text-white font-bold py-4 px-6 rounded-lg hover:bg-[#FF9500] transition-all duration-300 uppercase tracking-wide text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 mb-3 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none disabled:hover:translate-y-0'
              >
                {isOutOfStock ? 'Hết hàng' : '+ Thêm vào giỏ hàng'}
              </button>

              {/* WISHLIST BUTTON */}
              <button className='w-full border-2 border-[#FFA500] text-[#FFA500] font-bold py-3 px-6 rounded-lg hover:bg-orange-50 transition-all duration-300 uppercase tracking-wide'>
                ♡ Yêu thích
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className='bg-white py-12 px-8'>
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-2xl font-bold text-gray-900 mb-8'>Sản phẩm liên quan</h2>
          {relatedProducts && relatedProducts.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
              {relatedProducts.map((item: any, index: number) => (
                <CardComponent key={index} data={item} />
              ))}
            </div>
          ) : (
            <p className='text-gray-500 text-center py-8'>Không có sản phẩm liên quan</p>
          )}
        </div>
      </div>

      {/* COMMENTS SECTION */}
      <div className='bg-gray-50 py-12 px-8'>
        <div className='max-w-7xl mx-auto'>
          {id && <Comment id={Number(id)} reviews={product.product_reviews} getProduct={getProductById} />}
        </div>
      </div>
    </>
  )
}

export default DetailProductPage
