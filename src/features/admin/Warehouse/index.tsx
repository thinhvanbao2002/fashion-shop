/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import { Typography } from 'antd'
import WarehouseList from './WarehouseList'
import WarehouseForm from './WarehouseForm'

const { Title } = Typography

const Warehouse = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null)

  const handleOpenForm = (warehouse?: any) => {
    setSelectedWarehouse(warehouse)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setSelectedWarehouse(null)
    setIsFormOpen(false)
  }

  return (
    <div style={{ padding: '24px' }}>
      <WarehouseList onOpenForm={handleOpenForm} />
      {isFormOpen && <WarehouseForm open={isFormOpen} onClose={handleCloseForm} warehouse={selectedWarehouse} />}
    </div>
  )
}

export default Warehouse
