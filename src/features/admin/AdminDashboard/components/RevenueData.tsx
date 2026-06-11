import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface RevenueChartProps {
  data: any[]
  dataKey?: string
  title?: string
}

const RevenueChart = ({ data, dataKey = 'month', title = '📈 Xu hướng doanh thu hàng tháng' }: RevenueChartProps) => {
  return (
    <div className='bg-sky-50 rounded-xl p-6 shadow-sm'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-lg font-bold text-sky-950 tracking-tight'>{title}</h2>
      </div>

      <ResponsiveContainer width='100%' height={350}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray='3 3' stroke='#f4f4f5' vertical={false} />
          <XAxis dataKey={dataKey} stroke='#71717a' tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
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
                  <p className='text-xs font-semibold text-zinc-400'>{payload[0].payload[dataKey]}</p>
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
            stroke='#0284c7'
            strokeWidth={3}
            dot={{ r: 4, fill: '#0284c7', strokeWidth: 1, stroke: '#fff' }}
            activeDot={{ r: 6, fill: '#0369a1', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueChart
