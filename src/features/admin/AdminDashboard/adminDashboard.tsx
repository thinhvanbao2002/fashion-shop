import { useCallback, useEffect, useState } from 'react'
import './adminDashbroad.css'
import { adminDashboardServices } from './adminDashboardApis'
import { formatPrice } from 'common/utils'
import RevenueChart from './components/RevenueData'
import { Button, DatePicker, Select } from 'antd'

const { RangePicker } = DatePicker
const yearOptions = Array.from({ length: 7 }, (_, index) => {
  const year = new Date().getFullYear() - 3 + index

  return { value: year, label: `Năm ${year}` }
})

function AdminDashboardScreen() {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedDateRange, setSelectedDateRange] = useState<any>(null)
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
      const statisticFilters = selectedDateRange
        ? {
            from_date: selectedDateRange[0].format('YYYY-MM-DD'),
            to_date: selectedDateRange[1].format('YYYY-MM-DD')
          }
        : {}
      const overviewFilters = selectedDateRange
        ? statisticFilters
        : {
            from_date: `${selectedYear}-01-01`,
            to_date: `${selectedYear}-12-31`
          }
      const [resOverview, resStats] = await Promise.all([
        adminDashboardServices.get(overviewFilters),
        adminDashboardServices.getStatistics(selectedYear.toString(), 5, statisticFilters)
      ])
      if (resOverview) {
        setAdminDashboardData({ ...resOverview.data })
      }
      if (resStats) {
        setStatsData({ ...resStats.data })
      }
    } catch (error) {
      console.log('getDashboardData error:', error)
    }
  }, [selectedDateRange, selectedYear])

  useEffect(() => {
    getDashboardData()
  }, [getDashboardData])

  const isDateFiltered = Boolean(selectedDateRange)
  const chartData = isDateFiltered ? statsData?.revenue?.byDay || [] : statsData?.revenue?.byMonth || []
  const chartDataKey = isDateFiltered ? 'day' : 'month'
  const chartTitle = isDateFiltered ? '📈 Xu hướng doanh thu theo ngày' : '📈 Xu hướng doanh thu hàng tháng'
  const filteredPeriodLabel = selectedDateRange
    ? `${selectedDateRange[0].format('DD/MM/YYYY')} - ${selectedDateRange[1].format('DD/MM/YYYY')}`
    : ''
  const kpiPeriodLabel = isDateFiltered ? filteredPeriodLabel : `Năm ${selectedYear}`

  const handleClearStatisticFilter = () => {
    setSelectedDateRange(null)
  }

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

      <div className='bg-white border-zinc-200 rounded-xl p-5 shadow-sm flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div>
          <h2 className='text-base font-bold text-zinc-900'>Bộ lọc thống kê</h2>
          <p className='mt-1 text-sm text-zinc-500'>Lọc riêng doanh thu theo khoảng ngày/tháng/năm chỉ định.</p>
        </div>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
          <Select
            value={selectedYear}
            options={yearOptions}
            className='h-10 min-w-[130px]'
            onChange={(value) => {
              setSelectedYear(value)
              setSelectedDateRange(null)
            }}
          />
          <RangePicker
            value={selectedDateRange}
            className='h-10'
            format='DD/MM/YYYY'
            placeholder={['Từ ngày/tháng/năm', 'Đến ngày/tháng/năm']}
            onChange={(value) => {
              setSelectedDateRange(value)
              if (value?.[0]) setSelectedYear(value[0].year())
            }}
          />
          <Button className='h-10' onClick={handleClearStatisticFilter}>
            Xóa lọc
          </Button>
        </div>
      </div>

      {/* Main KPI Counter Cards (Monochromatic) */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
        <div
          className='rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between'
          style={{ backgroundColor: '#e0f2fe', border: '1px solid #bae6fd' }}
        >
          <div>
            <span className='text-xs font-bold uppercase tracking-wider' style={{ color: '#0369a1' }}>
              Khách hàng
            </span>
            <div className='font-mono text-3xl font-extrabold mt-2 tracking-tight' style={{ color: '#082f49' }}>
              {formatPrice(adminDashboardData.countUsers || 0)}
            </div>
            <p className='mt-1 text-xs font-medium' style={{ color: '#0369a1' }}>
              {kpiPeriodLabel}
            </p>
          </div>
          <div
            className='w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold'
            style={{ backgroundColor: '#bae6fd', border: '1px solid #7dd3fc', color: '#0369a1' }}
          >
            👤
          </div>
        </div>

        <div
          className='rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between'
          style={{ backgroundColor: '#dcfce7', border: '1px solid #bbf7d0' }}
        >
          <div>
            <span className='text-xs font-bold uppercase tracking-wider' style={{ color: '#047857' }}>
              Sản phẩm
            </span>
            <div className='font-mono text-3xl font-extrabold mt-2 tracking-tight' style={{ color: '#064e3b' }}>
              {formatPrice(adminDashboardData.countProducts || 0)}
            </div>
            <p className='mt-1 text-xs font-medium' style={{ color: '#047857' }}>
              {kpiPeriodLabel}
            </p>
          </div>
          <div
            className='w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold'
            style={{ backgroundColor: '#bbf7d0', border: '1px solid #86efac', color: '#047857' }}
          >
            📦
          </div>
        </div>

        <div
          className='rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between'
          style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}
        >
          <div>
            <span className='text-xs font-bold uppercase tracking-wider' style={{ color: '#b45309' }}>
              Loại danh mục
            </span>
            <div className='font-mono text-3xl font-extrabold mt-2 tracking-tight' style={{ color: '#78350f' }}>
              {formatPrice(adminDashboardData.countCategories || 0)}
            </div>
            <p className='mt-1 text-xs font-medium' style={{ color: '#b45309' }}>
              {kpiPeriodLabel}
            </p>
          </div>
          <div
            className='w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold'
            style={{ backgroundColor: '#fde68a', border: '1px solid #fcd34d', color: '#b45309' }}
          >
            📂
          </div>
        </div>

        <div
          className='rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between'
          style={{ backgroundColor: '#ffe4e6', border: '1px solid #fecdd3' }}
        >
          <div>
            <span className='text-xs font-bold uppercase tracking-wider' style={{ color: '#be123c' }}>
              Đơn hàng
            </span>
            <div className='font-mono text-3xl font-extrabold mt-2 tracking-tight' style={{ color: '#881337' }}>
              {formatPrice(adminDashboardData.countOrders || 0)}
            </div>
            <p className='mt-1 text-xs font-medium' style={{ color: '#be123c' }}>
              {kpiPeriodLabel}
            </p>
          </div>
          <div
            className='w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold'
            style={{ backgroundColor: '#fecdd3', border: '1px solid #fda4af', color: '#be123c' }}
          >
            📋
          </div>
        </div>
      </div>

      {/* Revenue Performance Cards (High Contrast B&W) */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        {/* Current Month */}
        <div
          className='rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-[140px] relative overflow-hidden'
          style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)', color: '#ffffff' }}
        >
          <div>
            <span className='text-xs font-bold uppercase tracking-wider' style={{ color: '#e0e7ff' }}>
              {isDateFiltered ? 'Doanh thu theo bộ lọc' : 'Doanh thu tháng này'}
            </span>
            <div className='font-mono text-3xl font-extrabold mt-3 tracking-tight' style={{ color: '#ffffff' }}>
              {formatPrice(
                (isDateFiltered ? statsData?.revenue?.currentPeriod : statsData?.revenue?.currentMonth) || 0
              )}{' '}
              <span className='text-lg font-semibold' style={{ color: '#e0e7ff' }}>
                đ
              </span>
            </div>
          </div>
          <div className='text-xs font-medium' style={{ color: '#e0e7ff' }}>
            Thời gian:{' '}
            {isDateFiltered ? filteredPeriodLabel : `Tháng ${new Date().getMonth() + 1} / ${new Date().getFullYear()}`}
          </div>
          <div
            className='absolute right-[-10px] bottom-[-10px] opacity-20 text-8xl font-black select-none pointer-events-none'
            style={{ color: '#ffffff' }}
          >
            M
          </div>
        </div>

        {/* Current Quarter */}
        <div
          className='rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-[140px] relative overflow-hidden'
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #0f766e 100%)', color: '#ffffff' }}
        >
          <div>
            <span className='text-xs font-bold uppercase tracking-wider' style={{ color: '#ecfdf5' }}>
              Doanh thu quý này
            </span>
            <div className='font-mono text-3xl font-extrabold mt-3 tracking-tight' style={{ color: '#ffffff' }}>
              {formatPrice(statsData?.revenue?.currentQuarter || 0)}{' '}
              <span className='text-lg font-semibold' style={{ color: '#ecfdf5' }}>
                đ
              </span>
            </div>
          </div>
          <div className='text-xs font-medium' style={{ color: '#ecfdf5' }}>
            Thời gian: Quý {Math.floor(new Date().getMonth() / 3) + 1} / {new Date().getFullYear()}
          </div>
          <div
            className='absolute right-[-10px] bottom-[-10px] opacity-20 text-8xl font-black select-none pointer-events-none'
            style={{ color: '#ffffff' }}
          >
            Q
          </div>
        </div>

        {/* Selected Year */}
        <div
          className='rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-[140px] relative overflow-hidden'
          style={{ background: 'linear-gradient(135deg, #c026d3 0%, #e11d48 100%)', color: '#ffffff' }}
        >
          <div>
            <span className='text-xs font-bold uppercase tracking-wider' style={{ color: '#fdf4ff' }}>
              Doanh thu cả năm
            </span>
            <div className='font-mono text-3xl font-extrabold mt-3 tracking-tight' style={{ color: '#ffffff' }}>
              {formatPrice(statsData?.revenue?.currentYear || 0)}{' '}
              <span className='text-lg font-semibold' style={{ color: '#fdf4ff' }}>
                đ
              </span>
            </div>
          </div>
          <div className='text-xs font-medium' style={{ color: '#fdf4ff' }}>
            Thời gian: Toàn bộ năm {selectedYear}
          </div>
          <div
            className='absolute right-[-10px] bottom-[-10px] opacity-20 text-8xl font-black select-none pointer-events-none'
            style={{ color: '#ffffff' }}
          >
            Y
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className='w-full'>
        <RevenueChart data={chartData} dataKey={chartDataKey} title={chartTitle} />
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
