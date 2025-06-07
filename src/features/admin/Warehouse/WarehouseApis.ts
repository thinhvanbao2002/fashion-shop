import { IWarehouse, IPayloadListWarehouse, IPayloadListInventory } from './Warehouse.props'
import { handleObjectEmpty } from 'common/utils'
import { AxiosClient } from 'apis/axiosClient'
import { RECORD_SIZE } from 'common/config'

export const warehouseServices = {
  get: (params: IPayloadListWarehouse) => {
    console.log('🚀 ~ params:', params)
    const url = '/warehouse'
    const handleParams = handleObjectEmpty(params)
    return AxiosClient.get(url, {
      params: { ...handleParams, limit: RECORD_SIZE }
    })
  },
  post: (payload: IWarehouse) => {
    const url = '/warehouse'
    return AxiosClient.post(url, {
      ...payload
    })
  },
  patch: (value: any) => {
    const url = `/warehouse/${value?.id}`
    return AxiosClient.patch(url, {
      ...value
    })
  },
  delete: (id: number) => {
    const url = `/warehouse/${id}`
    return AxiosClient.delete(url)
  },

  getById: (id: any) => {
    const url = `/warehouse/${id}`
    return AxiosClient.get(url)
  },
  getInventory: (params: IPayloadListInventory) => {
    const url = `/warehouse/${params.warehouseId}/inventory`
    const handleParams = handleObjectEmpty(params)
    return AxiosClient.get(url, {
      params: { ...handleParams, limit: RECORD_SIZE }
    })
  },

  importProduct: (body: any) => {
    console.log('🚀 ~ body:', body)
    const url = `/warehouse-product`
    return AxiosClient.post(url, body)
  }
}
