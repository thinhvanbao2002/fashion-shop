/* eslint-disable @typescript-eslint/no-empty-object-type */
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL

export interface Warehouse {
  id: string
  code: string
  name: string
  createdAt: string
  address: string
}

export interface CreateWarehouseDto {
  code: string
  name: string
  address: string
}

export interface UpdateWarehouseDto extends CreateWarehouseDto {}

export interface WarehouseFilter {
  code?: string
  name?: string
  createdAt?: string
}

const warehouseApi = {
  getAll: async (filters?: WarehouseFilter) => {
    const response = await axios.get(`${API_URL}/warehouses`, { params: filters })
    return response.data
  },

  getById: async (id: string) => {
    const response = await axios.get(`${API_URL}/warehouses/${id}`)
    return response.data
  },

  create: async (data: CreateWarehouseDto) => {
    const response = await axios.post(`${API_URL}/warehouses`, data)
    return response.data
  },

  update: async (id: string, data: UpdateWarehouseDto) => {
    const response = await axios.put(`${API_URL}/warehouses/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await axios.delete(`${API_URL}/warehouses/${id}`)
    return response.data
  },

  getInventory: async (id: string) => {
    const response = await axios.get(`${API_URL}/warehouses/${id}/inventory`)
    return response.data
  }
}

export default warehouseApi
