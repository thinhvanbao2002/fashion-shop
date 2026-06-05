import { useCallback, useEffect, useState } from 'react'
import './adminDashbroad.css'
import { adminDashboardServices } from './adminDashboardApis'
import { formatPrice } from 'common/utils'
import RevenueChart from './components/RevenueData'

function AdminDashboardScreen() {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [adminDashboardData, setAdminDashboardData] = useState<any>({})
  const [statsData, setStatsData] = useState<any>({
    topSellingProducts: [],
    topCustomers: [],
    topReviewedProducts: [],
    revenue: {
      byMonth: [],
      byQuarter: [],
      currentMonth: 0,
      currentQuarter: 0,
      currentYear: 0
    }
  })

  const getDashboardData = useCallback(async () => {
    try {
      const [resOverview, resStats] = await Promise.all([
        adminDashboardServices.get(),
        adminDashboardServices.getStatistics(selectedYear.toString(), 5)
      ])
      if (resOverview) {
        setAdminDashboardData({ ...resOverview.data })
      }
      if (resStats) {
        setStatsData({ ...resStats.data })
      }
    } catch (error) {
      console.log('🚀 ~ getDashboardData ~ error:', error)
    }
  }, [selectedYear])

  useEffect(() => {
    getDashboardData()
  }, [getDashboardData])

  return (
    <div className='w-full min-h-screen bg-zinc-50/50 p-6 flex flex-col gap-6 text-zinc-900 font-sans'>
      {/* Header section */}
      <div className='flex items-center justify-between border-b border-zinc-200 pb-5'>
        <div>
          <h1 className='text-3xl font-extrabold text-zinc-900 tracking-tight'>Báo Cáo Tổng Quan</h1>
          <p className='text-zinc-500 text-sm mt-1'>
            Thống kê số liệu, doanh thu và xếp hạng sản phẩm, khách hàng của hệ thống.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50 border-zinc-200 rounded-md px-2 py-1 font-mono'>
            Admin Panel
          </span>
        </div>
      </div>

      {/* Main KPI Counter Cards (Monochromatic) */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
        <div className='bg-white border-zinc-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between'>
          <div>
            <span className='text-xs font-bold uppercase tracking-wider text-zinc-400'>Khách hàng</span>
            <div className='font-mono text-3xl font-extrabold text-black mt-2 tracking-tight'>
              {formatPrice(adminDashboardData.countUsers || 0)}
            </div>
          </div>
          <div className='w-12 h-12 rounded-lg bg-zinc-50 border-zinc-200 flex items-center justify-center text-zinc-600 text-lg font-bold'>
            👤
          </div>
        </div>

        <div className='bg-white border-zinc-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between'>
          <div>
            <span className='text-xs font-bold uppercase tracking-wider text-zinc-400'>Sản phẩm</span>
            <div className='font-mono text-3xl font-extrabold text-black mt-2 tracking-tight'>
              {formatPrice(adminDashboardData.countProducts || 0)}
            </div>
          </div>
          <div className='w-12 h-12 rounded-lg bg-zinc-50 border-zinc-200 flex items-center justify-center text-zinc-600 text-lg font-bold'>
            📦
          </div>
        </div>

        <div className='bg-white border-zinc-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between'>
          <div>
            <span className='text-xs font-bold uppercase tracking-wider text-zinc-400'>Loại danh mục</span>
            <div className='font-mono text-3xl font-extrabold text-black mt-2 tracking-tight'>
              {formatPrice(adminDashboardData.countCategories || 0)}
            </div>
          </div>
          <div className='w-12 h-12 rounded-lg bg-zinc-50 border-zinc-200 flex items-center justify-center text-zinc-600 text-lg font-bold'>
            📂
          </div>
        </div>

        <div className='bg-white border-zinc-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between'>
          <div>
            <span className='text-xs font-bold uppercase tracking-wider text-zinc-400'>Đơn hàng</span>
            <div className='font-mono text-3xl font-extrabold text-black mt-2 tracking-tight'>
              {formatPrice(adminDashboardData.countOrders || 0)}
            </div>
          </div>
          <div className='w-12 h-12 rounded-lg bg-zinc-50 border-zinc-200 flex items-center justify-center text-zinc-600 text-lg font-bold'>
            📋
          </div>
        </div>
      </div>

      {/* Revenue Performance Cards (High Contrast B&W) */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        {/* Current Month */}
        <div className='bg-zinc-950 border-zinc-200/30 text-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-[140px] relative overflow-hidden'>
          <div>
            <span className='text-xs font-bold uppercase tracking-wider text-zinc-400'>Doanh thu tháng này</span>
            <div className='font-mono text-3xl font-extrabold text-white mt-3 tracking-tight'>
              {formatPrice(statsData?.revenue?.currentMonth || 0)}{' '}
              <span className='text-lg font-semibold text-zinc-400'>đ</span>
            </div>
          </div>
          <div className='text-zinc-500 text-xs font-medium'>
            Thời gian: Tháng {new Date().getMonth() + 1} / {new Date().getFullYear()}
          </div>
          <div className='absolute right-[-10px] bottom-[-10px] opacity-10 text-8xl font-black select-none pointer-events-none text-zinc-400'>
            M
          </div>
        </div>

        {/* Current Quarter */}
        <div className='bg-white border-zinc-200 text-zinc-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-[140px] relative overflow-hidden'>
          <div>
            <span className='text-xs font-bold uppercase tracking-wider text-zinc-400'>Doanh thu quý này</span>
            <div className='font-mono text-3xl font-extrabold text-black mt-3 tracking-tight'>
              {formatPrice(statsData?.revenue?.currentQuarter || 0)}{' '}
              <span className='text-lg font-semibold text-zinc-500'>đ</span>
            </div>
          </div>
          <div className='text-zinc-400 text-xs font-medium'>
            Thời gian: Quý {Math.floor(new Date().getMonth() / 3) + 1} / {new Date().getFullYear()}
          </div>
          <div className='absolute right-[-10px] bottom-[-10px] opacity-5 text-8xl font-black select-none pointer-events-none text-zinc-900'>
            Q
          </div>
        </div>

        {/* Selected Year */}
        <div className='bg-zinc-900 border-zinc-800/30 text-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-[140px] relative overflow-hidden'>
          <div>
            <span className='text-xs font-bold uppercase tracking-wider text-zinc-400'>Doanh thu cả năm</span>
            <div className='font-mono text-3xl font-extrabold text-white mt-3 tracking-tight'>
              {formatPrice(statsData?.revenue?.currentYear || 0)}{' '}
              <span className='text-lg font-semibold text-zinc-400'>đ</span>
            </div>
          </div>
          <div className='text-zinc-400 text-xs font-medium'>Thời gian: Toàn bộ năm {selectedYear}</div>
          <div className='absolute right-[-10px] bottom-[-10px] opacity-10 text-8xl font-black select-none pointer-events-none text-zinc-400'>
            Y
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className='w-full'>
        <RevenueChart
          data={statsData?.revenue?.byMonth || []}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
      </div>

      {/* Grid of Top Statistical Entities */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Top 5 Products sold the most */}
        <div className='bg-white border-zinc-200 rounded-xl p-5 shadow-sm flex flex-col gap-4'>
          <div className='border-b border-zinc-200 pb-3 flex items-center justify-between'>
            <h3 className='font-bold text-zinc-900 tracking-tight flex items-center gap-2'>
              🔥 Top sản phẩm bán chạy nhất
            </h3>
            <span className='bg-zinc-50 text-zinc-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded border-zinc-200'>
              TOP 5
            </span>
          </div>

          <div className='flex flex-col gap-3.5'>
            {statsData?.topSellingProducts?.length > 0 ? (
              statsData.topSellingProducts.map((item: any, idx: number) => (
                <div key={item.product_id || idx} className='flex items-center justify-between gap-3 group'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-full bg-zinc-50 border-zinc-200 flex items-center justify-center text-xs font-extrabold text-zinc-800 font-mono'>
                      {idx + 1}
                    </div>
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        className='w-10 h-10 object-cover rounded border-zinc-200 group-hover:scale-105 transition-transform duration-200'
                        alt={item.product?.name}
                      />
                    ) : (
                      <div className='w-10 h-10 rounded bg-zinc-50 border-zinc-200 flex items-center justify-center text-zinc-400 font-bold text-xs'>
                        📦
                      </div>
                    )}
                    <div className='flex flex-col'>
                      <span className='text-sm font-semibold text-zinc-900 line-clamp-1 group-hover:text-black transition-colors'>
                        {item.product?.name || `Sản phẩm #${item.product_id}`}
                      </span>
                      <span className='text-xs text-zinc-500 font-mono'>
                        {item.product?.price ? formatPrice(item.product.price) + ' đ' : 'Liên hệ'}
                      </span>
                    </div>
                  </div>
                  <div className='text-right'>
                    <span className='bg-zinc-50 text-zinc-800 border-zinc-200 font-mono font-bold text-xs rounded px-2 py-0.5'>
                      {item.total_sold} đã bán
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-6 text-zinc-400 text-sm'>Không có dữ liệu</div>
            )}
          </div>
        </div>

        {/* Top 5 Customers buying the most */}
        <div className='bg-white border-zinc-200 rounded-xl p-5 shadow-sm flex flex-col gap-4'>
          <div className='border-b border-zinc-200 pb-3 flex items-center justify-between'>
            <h3 className='font-bold text-zinc-900 tracking-tight flex items-center gap-2'>
              👑 Khách hàng thân thiết nhất
            </h3>
            <span className='bg-zinc-50 text-zinc-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded border-zinc-200'>
              TOP 5
            </span>
          </div>

          <div className='flex flex-col gap-3.5'>
            {statsData?.topCustomers?.length > 0 ? (
              statsData.topCustomers.map((item: any, idx: number) => (
                <div key={item.customer_id || idx} className='flex items-center justify-between gap-3 group'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-full bg-zinc-50 border-zinc-200 flex items-center justify-center text-xs font-extrabold text-zinc-800 font-mono'>
                      {idx + 1}
                    </div>
                    {item.customer?.avatar ? (
                      <img
                        src={item.customer.avatar}
                        className='w-10 h-10 object-cover rounded-full border-zinc-200 group-hover:scale-105 transition-transform duration-200'
                        alt={item.customer?.name}
                      />
                    ) : (
                      <div className='w-10 h-10 rounded-full bg-zinc-50 border-zinc-200 flex items-center justify-center text-zinc-800 font-bold text-xs'>
                        {item.customer?.name?.charAt(0).toUpperCase() || '👤'}
                      </div>
                    )}
                    <div className='flex flex-col'>
                      <span className='text-sm font-semibold text-zinc-900 line-clamp-1 group-hover:text-black transition-colors'>
                        {item.customer?.name || `Khách hàng #${item.customer_id}`}
                      </span>
                      <span className='text-xs text-zinc-500 font-mono'>
                        {item.customer?.phone || item.customer?.email || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className='text-right flex flex-col items-end gap-0.5'>
                    <span className='text-xs font-bold font-mono text-zinc-950'>{formatPrice(item.total_spent)} đ</span>
                    <span className='text-[10px] text-zinc-400 font-medium'>{item.total_orders} đơn hàng</span>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-6 text-zinc-400 text-sm'>Không có dữ liệu</div>
            )}
          </div>
        </div>

        {/* Top 5 Products having the most reviews */}
        <div className='bg-white border-zinc-200 rounded-xl p-5 shadow-sm flex flex-col gap-4'>
          <div className='border-b border-zinc-200 pb-3 flex items-center justify-between'>
            <h3 className='font-bold text-zinc-900 tracking-tight flex items-center gap-2'>
              💬 Sản phẩm được quan tâm nhiều nhất
            </h3>
            <span className='bg-zinc-50 text-zinc-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded border-zinc-200'>
              ĐÁNH GIÁ
            </span>
          </div>

          <div className='flex flex-col gap-3.5'>
            {statsData?.topReviewedProducts?.length > 0 ? (
              statsData.topReviewedProducts.map((item: any, idx: number) => (
                <div key={item.product_id || idx} className='flex items-center justify-between gap-3 group'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-full bg-zinc-50 border-zinc-200 flex items-center justify-center text-xs font-extrabold text-zinc-800 font-mono'>
                      {idx + 1}
                    </div>
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        className='w-10 h-10 object-cover rounded border-zinc-200 group-hover:scale-105 transition-transform duration-200'
                        alt={item.product?.name}
                      />
                    ) : (
                      <div className='w-10 h-10 rounded bg-zinc-50 border-zinc-200 flex items-center justify-center text-zinc-400 font-bold text-xs'>
                        📦
                      </div>
                    )}
                    <div className='flex flex-col'>
                      <span className='text-sm font-semibold text-zinc-900 line-clamp-1 group-hover:text-black transition-colors'>
                        {item.product?.name || `Sản phẩm #${item.product_id}`}
                      </span>
                      <span className='text-xs text-zinc-500 font-mono'>
                        {item.product?.price ? formatPrice(item.product.price) + ' đ' : 'Liên hệ'}
                      </span>
                    </div>
                  </div>
                  <div className='text-right'>
                    <span className='bg-zinc-950 text-white text-xs font-mono font-semibold rounded-full px-2.5 py-0.5 border-zinc-800/30 shadow-sm'>
                      ⭐ {item.total_reviews} review
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-6 text-zinc-400 text-sm'>Không có dữ liệu</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardScreen
