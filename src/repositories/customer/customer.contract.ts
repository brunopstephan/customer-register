import { Customer } from '@/schemas'
import { CustomerEntity } from './customer.entity'

export abstract class CustomerContract {
  abstract get(params: CustomerEntity['get']): Promise<Customer | null>
  abstract create(params: CustomerEntity['create']): Promise<Customer>
  abstract update(params: CustomerEntity['update']): Promise<Customer>
  abstract delete(params: CustomerEntity['delete']): Promise<void>
  abstract scan(): Promise<Customer[]>
}
