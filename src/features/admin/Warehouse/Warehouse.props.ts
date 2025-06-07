export interface IWarehouse {
  id: string
  code: string
  name: string
  createdAt: string
  address: string
}

export interface IPayloadListWarehouse {
  page: number
  take: number
  code?: string
  name?: string
  createdAt?: string
}

export interface IWarehouseFilter {
  code?: string
  name?: string
  createdAt?: string
}

export interface IInventoryItem {
  id: string
  productId: string
  productName: string
  productCode: string
  quantity: number
  unit: string
  lastUpdated: string
}

export interface IPayloadListInventory {
  page: number
  take: number
  warehouseId: string
  productName?: string
  productCode?: string
}
