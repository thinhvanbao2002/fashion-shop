export interface IDataAccount {
  phone?: string
  name?: string
  email?: string
  password?: string
  avatar?: string
}

export interface IAccount {
  id?: string | null
  name: string
  phone: string
  email: string
  password?: string
  avatar?: string
  status: string
}
export interface IPayLoadListUser {
  page?: number
  limit?: number
  q?: string
  status?: string
  from_date?: string
  to_date?: string
}
