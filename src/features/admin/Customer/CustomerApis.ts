import { handleObjectEmpty } from 'common/utils'
import { AxiosClient } from '../../../apis/axiosClient'
import { RECORD_SIZE } from 'common/config'

export interface IQuery {
  page: number
}

export const customerServices = {
  get: (params: IQuery) => {
    const url = '/customer'
    const handleParams = handleObjectEmpty(params)
    return AxiosClient.get(url, {
      params: { ...handleParams, limit: RECORD_SIZE }
    })
  },
  put: (value: any) => {
    const url = `/customer/${value?.id}`
    return AxiosClient.put(url, {
      ...value
    })
  },
  delete: (id: number) => {
    const url = `/customer/${id}`
    return AxiosClient.delete(url)
  }
}
