import { Customer } from '@/schemas'

export type CustomerEntity = {
  get: {
    id: string
  }
  create: {
    data: Customer
  }
  update: {
    id: string
    data: Partial<Customer>
  }
  delete: {
    id: string
  }
}
