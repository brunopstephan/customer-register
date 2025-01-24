import { CustomerContract, CustomerEntity } from '@/repositories'
import { Customer } from '@/schemas'

export class MockCustomersRepository implements CustomerContract {
  public customers = [
    {
      customerId: '1',
      active: true,
      addresses: [
        {
          id: '1',
          line: 'test',
        },
      ],
      birthdate: '2020-01-01',
      contacts: [
        {
          id: '1',
          email: 'test@test.com',
          main: true,
          phone: '19 9999999999',
        },
        {
          id: '2',
          email: 'test2@test.com',
          main: false,
          phone: '19 9999999999',
        },
      ],
      fullName: 'Test Da Silva',
    },
  ] as Customer[]

  get(params: CustomerEntity['get']): Promise<Customer | null> {
    return Promise.resolve(
      this.customers.find((customer) => customer.customerId === params.id) ||
        null,
    )
  }

  create(params: CustomerEntity['create']): Promise<Customer> {
    const customer = { ...params.data, id: '1' } as Customer

    this.customers.push(customer)

    return Promise.resolve(customer)
  }

  update(params: CustomerEntity['update']): Promise<Customer> {
    const customer = this.customers.find(
      (customer) => customer.customerId === params.id,
    )

    if (!customer) {
      throw new Error('Customer not found')
    }

    const updated = { ...customer, ...params.data } as Customer

    this.customers = this.customers.map((customer) =>
      customer.customerId === updated.customerId ? updated : customer,
    )

    return Promise.resolve(updated)
  }

  delete(params: CustomerEntity['delete']): Promise<void> {
    this.customers = this.customers.filter(
      (customer) => customer.customerId !== params.id,
    )

    return Promise.resolve()
  }

  scan(): Promise<Customer[]> {
    return Promise.resolve(this.customers)
  }
}
