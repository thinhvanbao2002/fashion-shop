import { MessageOutlined, SendOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Input } from 'antd'
import { useEffect, useState } from 'react'
import { openNotificationError, timeSince } from 'common/utils'
import { productServices } from '../product/productApis'

const { TextArea } = Input

interface Review {
  id?: number
  comment: string
  created_at: string
  user?: {
    name?: string
  }
}

interface IPropsComment {
  id: number
  reviews?: Review[]
  getProduct?: (id: number) => void | Promise<void>
}

function Comment({ id, reviews = [], getProduct }: IPropsComment) {
  const [comment, setComment] = useState('')
  const [products, setProducts] = useState<Review[]>(reviews)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setProducts(reviews || [])
  }, [reviews])

  const handleSubmit = async () => {
    const trimmedComment = comment.trim()
    if (!trimmedComment || isSubmitting) return

    try {
      setIsSubmitting(true)
      await productServices.comment({ comment: trimmedComment, product_id: id })
      setComment('')
      await getProduct?.(id)
    } catch (error) {
      openNotificationError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <section className='overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-30px_rgba(255,165,0,0.35)]'>
      <div className='relative overflow-hidden bg-gradient-to-r from-[#FF9500] via-[#FFA500] to-[#FFB52E] px-6 py-8 text-white sm:px-10'>
        <div className='absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10' />
        <div className='absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/10' />

        <div className='relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <div className='mb-3 flex items-center gap-2 text-sm font-semibold text-orange-50'>
              <MessageOutlined />
              Chia sẻ trải nghiệm của bạn
            </div>
            <h2 className='text-2xl font-bold sm:text-3xl'>Đánh giá sản phẩm</h2>
            <p className='mt-2 max-w-xl text-sm leading-6 text-orange-50'>
              Mỗi góp ý của bạn đều giúp cửa hàng hoàn thiện sản phẩm và phục vụ tốt hơn.
            </p>
          </div>

          <div className='flex w-fit items-center gap-3 rounded-2xl bg-white/15 px-5 py-3 backdrop-blur-sm'>
            <span className='text-3xl font-bold'>{products.length}</span>
            <span className='text-sm leading-5 text-orange-50'>
              đánh giá
              <br />
              từ khách hàng
            </span>
          </div>
        </div>
      </div>

      <div className='grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.5fr)] lg:p-10'>
        <div>
          <div className='sticky top-6 rounded-2xl bg-orange-50/70 p-5 shadow-[0_12px_35px_-24px_rgba(255,165,0,0.55)] sm:p-6'>
            <div className='mb-5 flex items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFA500] text-white shadow-lg shadow-orange-200'>
                <SendOutlined />
              </div>
              <div>
                <h3 className='font-bold text-gray-900'>Viết đánh giá</h3>
                <p className='text-xs text-gray-500'>Ý kiến chân thật luôn được trân trọng</p>
              </div>
            </div>

            <TextArea
              rows={7}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Sản phẩm có điều gì khiến bạn hài lòng?'
              maxLength={2000}
              className='!resize-none !rounded-xl !border-orange-100 !bg-white !p-4 !text-sm hover:!border-[#FFA500] focus:!border-[#FFA500] focus:!shadow-[0_0_0_3px_rgba(255,165,0,0.12)]'
            />

            <div className='mb-4 mt-2 flex items-center justify-between text-xs text-gray-400'>
              <span>Nhấn Ctrl + Enter để gửi</span>
              <span>{comment.length}/2000</span>
            </div>

            <button
              type='button'
              onClick={handleSubmit}
              disabled={!comment.trim() || isSubmitting}
              className='flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFA500] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FF9500] hover:shadow-xl disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none'
            >
              <SendOutlined />
              {isSubmitting ? 'Đang gửi đánh giá...' : 'Gửi đánh giá'}
            </button>
          </div>
        </div>

        <div>
          <div className='mb-5 flex items-center justify-between'>
            <div>
              <h3 className='text-xl font-bold text-gray-900'>Khách hàng nói gì?</h3>
              <p className='mt-1 text-sm text-gray-500'>Những chia sẻ mới nhất về sản phẩm</p>
            </div>
            <div className='hidden items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-[#FF9500] sm:flex'>
              <MessageOutlined /> Ý kiến khách hàng
            </div>
          </div>

          {products.length > 0 ? (
            <div className='space-y-4'>
              {products.map((review, index) => {
                const customerName = review.user?.name || 'Khách hàng ẩn danh'
                const avatarLetter = review.user?.name?.trim().charAt(0).toUpperCase()

                return (
                  <article
                    key={review.id || index}
                    className='group rounded-2xl bg-gray-50/70 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-50/60 hover:shadow-[0_14px_35px_-20px_rgba(255,165,0,0.35)] sm:p-6'
                  >
                    <div className='mb-4 flex items-center justify-between gap-4'>
                      <div className='flex min-w-0 items-center gap-3'>
                        <Avatar
                          size={46}
                          icon={avatarLetter ? undefined : <UserOutlined />}
                          className='flex-shrink-0 !bg-gradient-to-br !from-[#FFA500] !to-[#FF9500] !font-bold !text-white'
                        >
                          {avatarLetter}
                        </Avatar>
                        <div className='min-w-0'>
                          <p className='truncate text-sm font-bold text-gray-900'>{customerName}</p>
                          <p className='mt-0.5 text-xs text-gray-400'>{timeSince(review.created_at)}</p>
                        </div>
                      </div>
                      <span className='hidden rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-[#FF9500] sm:inline-block'>
                        Khách hàng
                      </span>
                    </div>

                    <p className='whitespace-pre-wrap break-words rounded-xl bg-white/80 px-4 py-3 text-sm leading-7 text-gray-600'>
                      {review.comment}
                    </p>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className='flex min-h-72 flex-col items-center justify-center rounded-2xl bg-orange-50/50 px-6 text-center'>
              <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl text-[#FFA500] shadow-sm'>
                <MessageOutlined />
              </div>
              <h4 className='font-bold text-gray-900'>Chưa có đánh giá nào</h4>
              <p className='mt-2 max-w-sm text-sm leading-6 text-gray-500'>
                Hãy là người đầu tiên chia sẻ cảm nhận về sản phẩm này.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Comment
