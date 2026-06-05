import { ArrowLeftOutlined, BookOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import { USER_PATH } from 'common/constants/paths'
import { formatDate, openNotificationError } from 'common/utils'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { blogServices } from './blogApis'

function BlogDetail() {
  const [blog, setBlog] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { id = '' } = useParams()
  const navigate = useNavigate()

  const getBlog = async (blogId: string) => {
    try {
      setIsLoading(true)
      const res = await blogServices.getById(blogId)
      setBlog(res?.data || null)
    } catch (error) {
      openNotificationError(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) getBlog(id)
  }, [id])

  if (isLoading) {
    return (
      <main className='min-h-screen bg-gray-50 px-5 py-10 sm:px-8'>
        <div className='mx-auto flex min-h-80 max-w-5xl items-center justify-center rounded-3xl bg-white text-sm text-gray-500 shadow-sm'>
          Đang tải bài viết...
        </div>
      </main>
    )
  }

  if (!blog) {
    return (
      <main className='min-h-screen bg-gray-50 px-5 py-10 sm:px-8'>
        <div className='mx-auto flex min-h-[420px] max-w-5xl flex-col items-center justify-center rounded-3xl bg-white px-6 text-center shadow-sm'>
          <div className='mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-3xl text-[#FFA500]'>
            <BookOutlined />
          </div>
          <h1 className='text-xl font-bold text-gray-900'>Không tìm thấy bài viết</h1>
          <button
            type='button'
            onClick={() => navigate(USER_PATH.BLOG)}
            className='mt-6 rounded-xl bg-[#FFA500] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#FF9500]'
          >
            Quay lại trang blog
          </button>
        </div>
      </main>
    )
  }

  const authorName = blog.user?.name || 'DN Shop'
  const avatarLetter = authorName.trim().charAt(0).toUpperCase()

  return (
    <main className='min-h-screen bg-gray-50 pb-12'>
      <div className='border-b border-gray-100 bg-white'>
        <div className='mx-auto max-w-5xl px-5 py-4 sm:px-8'>
          <button
            type='button'
            onClick={() => navigate(USER_PATH.BLOG)}
            className='flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-[#FFA500]'
          >
            <ArrowLeftOutlined />
            Quay lại danh sách bài viết
          </button>
        </div>
      </div>

      <article className='mx-auto max-w-5xl px-5 pt-8 sm:px-8 sm:pt-10'>
        <header className='mb-7 text-center'>
          <span className='inline-flex rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-[#FF9500]'>
            Góc thời trang
          </span>
          <h1 className='mx-auto mt-4 max-w-4xl text-3xl font-bold leading-tight text-gray-900 sm:text-4xl'>
            {blog.title}
          </h1>
          <div className='mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-400'>
            <Avatar
              size={38}
              src={blog.user?.avatar}
              icon={blog.user?.avatar ? undefined : <UserOutlined />}
              className='!bg-[#FFA500] !text-white'
            >
              {!blog.user?.avatar && avatarLetter}
            </Avatar>
            <span className='font-semibold text-gray-700'>{authorName}</span>
            <span className='h-1 w-1 rounded-full bg-gray-300' />
            <span className='flex items-center gap-1.5'>
              <CalendarOutlined />
              {blog.created_at ? formatDate(blog.created_at) : 'Mới cập nhật'}
            </span>
          </div>
        </header>

        {blog.blog_photo && (
          <div className='mb-8 aspect-[16/8] overflow-hidden rounded-3xl bg-orange-50 shadow-[0_20px_60px_-38px_rgba(255,165,0,0.55)]'>
            <img className='h-full w-full object-cover' src={blog.blog_photo} alt={blog.title || 'Bài viết'} />
          </div>
        )}

        <div className='rounded-3xl bg-white px-5 py-7 shadow-[0_16px_50px_-34px_rgba(15,23,42,0.35)] sm:px-10 sm:py-10'>
          <div
            className='break-words text-[15px] leading-8 text-gray-600 [&_a]:font-semibold [&_a]:text-[#FFA500] [&_blockquote]:my-6 [&_blockquote]:rounded-r-xl [&_blockquote]:border-l-4 [&_blockquote]:border-[#FFA500] [&_blockquote]:bg-orange-50 [&_blockquote]:px-5 [&_blockquote]:py-3 [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_img]:my-7 [&_img]:max-w-full [&_img]:rounded-2xl [&_li]:mb-2 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_strong]:font-bold [&_strong]:text-gray-800 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6'
            dangerouslySetInnerHTML={{ __html: blog.content || '' }}
          />
        </div>
      </article>
    </main>
  )
}

export default BlogDetail
