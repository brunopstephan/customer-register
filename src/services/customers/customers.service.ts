import { CustomerContract } from '@/repositories'
import { Customer } from '@/schemas'
import { randomUUID } from 'node:crypto'

export class CustomersService {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly customerRespository: CustomerContract) {}

  async create({ active, addresses, birthDate, contacts, fullName }: Customer) {
    const data = {
      customerId: randomUUID(),
      active,
      fullName,
      birthDate,
      contacts,
      addresses,
    } as Customer

    const created = await this.customerRespository.create({
      data,
    })

    return created
  }

  async get(customerId: string) {
    const customer = await this.customerRespository.get({
      id: customerId,
    })

    return customer
  }

  async list() {
    const customers = await this.customerRespository.scan()

    return customers
  }
}
