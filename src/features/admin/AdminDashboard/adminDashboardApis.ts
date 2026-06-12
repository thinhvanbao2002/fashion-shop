import { AxiosClient } from '../../../apis/axiosClient'

export interface IQuery {
  page: number
}

export const adminDashboardServices = {
  get: (filters?: any) => {
    const url = '/overview'
    return AxiosClient.get(url, { params: { ...filters } })
  },
  getRevenueByYear: (year: number) => {
    const url = `/overview/revenue/${year}`
    return AxiosClient.get(url)
  },
  getStatistics: (year?: string, limit?: number, filters?: any) => {
    const url = '/overview/statistics'
    return AxiosClient.get(url, { params: { year, limit, ...filters } })
  }
}
