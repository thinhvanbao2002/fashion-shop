import { AxiosClient } from '../../../apis/axiosClient'

export interface IQuery {
  page: number
}

export const adminDashboardServices = {
  get: () => {
    const url = '/overview'
    return AxiosClient.get(url)
  },
  getRevenueByYear: (year: number) => {
    const url = `/overview/revenue/${year}`
    return AxiosClient.get(url)
  },
  getStatistics: (year?: string, limit?: number) => {
    const url = '/overview/statistics'
    return AxiosClient.get(url, { params: { year, limit } })
  }
}
