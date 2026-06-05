import { USER_PATH } from 'common/constants/paths'
import { formatPrice, openNotification, openNotificationError } from 'common/utils'
import { PRODUCT_VALUES } from 'features/customer/product/product.constants.'
import { ICartPayload, productServices } from 'features/customer/product/productApis'
import { useNavigate } from 'react-router'

interface ProductData {
  id: string
  name: string
  image?: string
  price: number
  product_type: keyof typeof PRODUCT_VALUES
}

function CardComponent({ data }: { data: ProductData }) {
  const navigate = useNavigate()

  const handleAddToCart = async (payload: ICartPayload) => {
    try {
      const res = await productServices.addToCart(payload)
      if (res) {
        openNotification('success', 'Thành công', 'Thêm sản phẩm vào giỏ hàng thành công!')
      }
    } catch (error) {
      openNotificationError(error)
    }
  }

  return (
    <>
      <div className='group w-full bg-white'>
        {/* PHẦN 1: HÌNH ẢNH */}
        <div className='relative w-full aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg mb-4'>
          <img
            src={data.image ? data?.image : 'https://bizweb.dktcdn.net/100/415/697/products/ak058.png?v=1701405312903'}
            alt='Product'
            className='w-full h-full object-cover object-center cursor-pointer'
            onClick={() => {
              navigate(`${USER_PATH.PRODUCT_DETAIL}/${data?.id}`)
            }}
          />

          {/* HOVER OVERLAY - Nút giỏ hàng & mắt */}
          <div className='absolute inset-0 flex items-center justify-center gap-4 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100 group-focus-within:opacity-100'>
            {/* Nút Mắt - Xem chi tiết */}
            <button
              onClick={() => {
                navigate(`${USER_PATH.PRODUCT_DETAIL}/${data?.id}`)
              }}
              className='flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/55 text-[#FF9500] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_24px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-orange-200/80 hover:bg-orange-50/65 hover:text-[#FF9500] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_8px_28px_rgba(255,165,0,0.28),0_0_0_4px_rgba(255,255,255,0.18)] focus-visible:scale-110 focus-visible:border-orange-200 focus-visible:bg-orange-50/70 focus-visible:text-[#FF9500] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200/40'
              title='Xem chi tiết'
            >
              <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                <path
                  fillRule='evenodd'
                  d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                  clipRule='evenodd'
                />
              </svg>
            </button>

            {/* Nút Giỏ hàng - Thêm vào giỏ */}
            <button
              onClick={() => {
                handleAddToCart({
                  product_id: Number(data.id),
                  product_number: 1
                })
              }}
              className='flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/55 text-[#FF9500] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_24px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-orange-200/80 hover:bg-orange-50/65 hover:text-[#FF9500] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_8px_28px_rgba(255,165,0,0.28),0_0_0_4px_rgba(255,255,255,0.18)] focus-visible:scale-110 focus-visible:border-orange-200 focus-visible:bg-orange-50/70 focus-visible:text-[#FF9500] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200/40'
              title='Thêm vào giỏ hàng'
            >
              <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1h7.586a1 1 0 00.99-1.243l-1.6-8A1 1 0 0011.586 3H5.716l-.708-2.957A1 1 0 004 1H3z' />
              </svg>
            </button>
          </div>
        </div>

        {/* PHẦN 2: TÊN SẢN PHẨM */}
        <div className='px-3 mb-2'>
          <h3
            className='text-sm font-semibold text-gray-800 line-clamp-2 hover:text-[#FFA500] transition-colors duration-200 cursor-pointer'
            onClick={() => navigate(`${USER_PATH.PRODUCT_DETAIL}/${data?.id}`)}
          >
            {data?.name}
          </h3>
        </div>

        {/* PHẦN 3: GIÁ TIỀN */}
        <div className='px-3 pb-3'>
          <p className='text-lg font-bold text-[#FFA500]'>{formatPrice(data?.price)} VND</p>
        </div>
      </div>
    </>
  )
}

export default CardComponent
