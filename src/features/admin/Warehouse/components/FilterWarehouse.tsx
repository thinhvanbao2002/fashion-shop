import { Card, Col, DatePicker, Input, Row } from 'antd'
import { IWarehouseFilter } from '../Warehouse.props'

interface FilterWarehouseProps {
  onChangeValue: (value: IWarehouseFilter) => void
}

export const FilterWarehouse = ({ onChangeValue }: FilterWarehouseProps) => {
  return (
    <Card>
      <Row gutter={[15, 15]}>
        <Col span={8}>
          <Input placeholder='Mã kho hàng' onChange={(e) => onChangeValue({ code: e.target.value })} />
        </Col>
        <Col span={8}>
          <Input placeholder='Tên kho hàng' onChange={(e) => onChangeValue({ name: e.target.value })} />
        </Col>
        <Col span={8}>
          <DatePicker
            style={{ width: '100%' }}
            placeholder='Ngày tạo'
            onChange={(date) => onChangeValue({ createdAt: date?.format('YYYY-MM-DD') })}
            format='DD/MM/YYYY'
          />
        </Col>
      </Row>
    </Card>
  )
}
