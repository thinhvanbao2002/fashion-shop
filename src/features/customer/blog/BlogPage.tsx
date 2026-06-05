import { ArrowRightOutlined, BookOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import { USER_PATH } from 'common/constants/paths'
import { formatDate, openNotificationError } from 'common/utils'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { blogServices } from './blogApis'

const getTextContent = (htmlString = '') => {
  const parser = new DOMParser()
  const document = parser.parseFromString(htmlString, 'text/html')
  return document.body.textContent?.trim() || ''
}

export default function Blog() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const getBlogs = async () => {
    try {
      setIsLoading(true)
      const res = await blogServices.get()
      setBlogs(res?.data || [])
    } catch (error) {
      openNotificationError(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getBlogs()
  }, [])

  return (
    <main className='min-h-screen bg-gray-50'>
      <section className='relative overflow-hidden bg-gradient-to-r from-[#FF9500] via-[#FFA500] to-[#FFB52E]'>
        <div className='absolute -right-24 -top-28 h-72 w-72 rounded-full bg-white/10' />
        <div className='absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-white/10' />
        <div className='relative mx-auto max-w-7xl px-5 py-12 text-white sm:px-8 sm:py-16'>
          <div className='mb-4 flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm'>
            <BookOutlined />
            Góc thời trang
          </div>
          <h1 className='max-w-2xl text-3xl font-bold leading-tight sm:text-4xl'>Bài viết của DN Shop</h1>
          <p className='mt-3 max-w-2xl text-sm leading-7 text-orange-50 sm:text-base'>
            Cập nhật xu hướng mới, bí quyết phối đồ và những câu chuyện thú vị về thời trang.
          </p>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10'>
        <div className='mb-6 flex items-end justify-between'>
          <div>
            <h2 className='text-xl font-bold text-gray-900 sm:text-2xl'>Bài viết mới nhất</h2>
            <div className='mt-2 h-1 w-12 rounded-full bg-[#FFA500]' />
          </div>
          {!isLoading && blogs.length > 0 && <p className='text-sm text-gray-400'>{blogs.length} bài viết</p>}
        </div>

        {isLoading ? (
          <div className='flex min-h-80 items-center justify-center rounded-3xl bg-white text-sm text-gray-500 shadow-sm'>
            Đang tải bài viết...
          </div>
        ) : blogs.length === 0 ? (
          <div className='flex min-h-[380px] flex-col items-center justify-center rounded-3xl bg-white px-6 text-center shadow-sm'>
            <div className='mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-3xl text-[#FFA500]'>
              <BookOutlined />
            </div>
            <h3 className='text-xl font-bold text-gray-900'>Chưa có bài viết nào</h3>
            <p className='mt-2 text-sm text-gray-500'>Những câu chuyện thời trang mới sẽ sớm xuất hiện tại đây.</p>
          </div>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {blogs.map((post) => {
              const description = getTextContent(post.content)
              const authorName = post.user?.name || 'DN Shop'
              const avatarLetter = authorName.trim().charAt(0).toUpperCase()

              return (
                <article
                  key={post.id}
                  onClick={() => navigate(`${USER_PATH.BLOG}/${post.id}`)}
                  className='group flex cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-[0_14px_45px_-32px_rgba(15,23,42,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_-30px_rgba(255,165,0,0.45)]'
                >
                  <div className='relative h-52 overflow-hidden bg-orange-50'>
                    {post.blog_photo ? (
                      <img
                        src={post.blog_photo}
                        alt={post.title || 'Bài viết'}
                        className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                    ) : (
                      <div className='flex h-full items-center justify-center text-4xl text-[#FFA500]'>
                        <BookOutlined />
                      </div>
                    )}
                    <span className='absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-[#FF9500] shadow-sm backdrop-blur-sm'>
                      Thời trang
                    </span>
                  </div>

                  <div className='flex flex-1 flex-col p-5'>
                    <h3 className='line-clamp-2 text-lg font-bold leading-7 text-gray-900 transition-colors group-hover:text-[#FFA500]'>
                      {post.title}
                    </h3>
                    <p className='mt-3 line-clamp-3 text-sm leading-6 text-gray-500'>
                      {description || 'Khám phá thêm những chia sẻ hữu ích từ DN Shop.'}
                    </p>

                    <div className='mt-auto flex items-center justify-between gap-3 pt-5'>
                      <div className='flex min-w-0 items-center gap-2.5'>
                        <Avatar
                          size={34}
                          src={post.user?.avatar}
                          icon={post.user?.avatar ? undefined : <UserOutlined />}
                          className='flex-shrink-0 !bg-[#FFA500] !text-white'
                        >
                          {!post.user?.avatar && avatarLetter}
                        </Avatar>
                        <div className='min-w-0'>
                          <p className='truncate text-xs font-bold text-gray-700'>{authorName}</p>
                          <p className='mt-0.5 flex items-center gap-1 text-[11px] text-gray-400'>
                            <CalendarOutlined />
                            {post.created_at ? formatDate(post.created_at) : 'Mới cập nhật'}
                          </p>
                        </div>
                      </div>
                      <span className='flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#FFA500] transition-all group-hover:bg-[#FFA500] group-hover:text-white'>
                        <ArrowRightOutlined />
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
