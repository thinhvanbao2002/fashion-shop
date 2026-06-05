import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface RevenueChartProps {
  data: any[]
  selectedYear: number
  setSelectedYear: (year: number) => void
}

const RevenueChart = ({ data, selectedYear, setSelectedYear }: RevenueChartProps) => {
  const listYear = ['2021', '2022', '2023', '2024', '2025', '2026', '2027']

  return (
    <div className='bg-white border-zinc-100 rounded-xl p-6 shadow-sm'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-lg font-bold text-zinc-900 tracking-tight'>📈 Xu hướng doanh thu hàng tháng</h2>

        {/* Bộ lọc chọn năm */}
        <select
          className='px-3 py-1.5 border border-zinc-200 rounded-lg text-sm font-semibold cursor-pointer bg-white text-zinc-900 hover:border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-900'
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {listYear.map((year) => (
            <option key={year} value={year}>
              Năm {year}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width='100%' height={350}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray='3 3' stroke='#f4f4f5' vertical={false} />
          <XAxis dataKey='month' stroke='#71717a' tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
          <YAxis
            stroke='#71717a'
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#71717a' }}
            tickFormatter={(value) => `${(value / 1000000).toLocaleString()}M`}
          />
          <Tooltip
            content={({ active, payload }) =>
              active && payload?.length ? (
                <div className='bg-zinc-950 text-white p-3 rounded-lg shadow-xl border border-zinc-900/30'>
                  <p className='text-xs font-semibold text-zinc-400'>{payload[0].payload.month}</p>
                  <p className='text-sm font-bold font-mono mt-0.5'>
                    {payload[0].value ? payload[0].value.toLocaleString() : 0} đ
                  </p>
                </div>
              ) : null
            }
          />
          <Line
            type='monotone'
            dataKey='revenue'
            stroke='#18181b'
            strokeWidth={3}
            dot={{ r: 4, fill: '#18181b', strokeWidth: 1, stroke: '#fff' }}
            activeDot={{ r: 6, fill: '#09090b', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueChart
