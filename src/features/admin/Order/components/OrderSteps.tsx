import { Steps } from 'antd'
import {
  ClockCircleOutlined,
  InboxOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons'

interface IStep {
  step: number
}

const OrderStep = ({ step }: IStep) => {
  const isCanceled = step === 5

  if (isCanceled) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 24px',
          background: 'linear-gradient(135deg, #fff1f0 0%, #fff 100%)',
          border: '1px solid #ffccc7',
          borderRadius: 12,
          color: '#cf1322',
          fontWeight: 600,
          fontSize: 15
        }}
      >
        <CloseCircleOutlined style={{ fontSize: 22, color: '#ff4d4f' }} />
        Đơn hàng đã bị hủy
      </div>
    )
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f6f8ff 0%, #fff 100%)',
        border: '1px solid #e8eaf6',
        borderRadius: 12,
        padding: '20px 24px'
      }}
    >
      <Steps
        current={step - 1}
        items={[
          {
            title: 'Chờ xác nhận',
            description: 'Đơn hàng mới',
            icon:
              step === 1 ? (
                <LoadingOutlined style={{ color: '#1677ff' }} />
              ) : (
                <ClockCircleOutlined />
              )
          },
          {
            title: 'Chuẩn bị hàng',
            description: 'Đang đóng gói',
            icon:
              step === 2 ? (
                <LoadingOutlined style={{ color: '#1677ff' }} />
              ) : (
                <InboxOutlined />
              )
          },
          {
            title: 'Vận chuyển',
            description: 'Đang giao hàng',
            icon:
              step === 3 ? (
                <LoadingOutlined style={{ color: '#1677ff' }} />
              ) : (
                <CarOutlined />
              )
          },
          {
            title: 'Hoàn thành',
            description: 'Đã giao thành công',
            icon: <CheckCircleOutlined />
          }
        ]}
      />
    </div>
  )
}

export default OrderStep
