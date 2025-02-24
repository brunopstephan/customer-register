import { CustomerContract } from '@/repositories'
import { Customer } from '@/schemas'
import { bodyParser } from '@/utils'
import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'
import { randomUUID } from 'node:crypto'

export class CustomersService {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly customerRespository: CustomerContract) {}

  async create(body: Customer): Promise<APIGatewayProxyStructuredResultV2> {
    const { errors, success, data } = bodyParser(body)

    if (!success) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Validation Error',
          errors,
        }),
      }
    }

    const contacts = data.contacts.map((contact) => ({
      ...contact,
      id: randomUUID(),
    }))

    const addresses = data.addresses.map((address) => ({
      ...address,
      id: randomUUID(),
    }))

    const creationData = {
      ...data,
      customerId: randomUUID(),
      contacts,
      addresses,
    } as Customer

    const created = await this.customerRespository.create({
      data: creationData,
    })

    return {
      statusCode: 201,
      body: JSON.stringify(created),
    }
  }

  async updateBasicData(
    customerId: string,
    body: Customer,
  ): Promise<APIGatewayProxyStructuredResultV2> {
    const { errors, success, data } = bodyParser(body, true)

    if (!success) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Validation Error',
          errors,
        }),
      }
    }

    const customer = await this.customerRespository.get({
      id: customerId,
    })

    if (!customer) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Customer not found' }),
      }
    }

    const updated = await this.customerRespository.update({
      id: customerId,
      data: {
        birthdate: data.birthdate || customer.birthdate,
        fullName: data.fullName || customer.fullName,
        active: data.active === undefined ? customer.active : data.active,
      },
    })

    return {
      statusCode: 200,
      body: JSON.stringify(updated),
    }
  }

  async get(customerId: string): Promise<APIGatewayProxyStructuredResultV2> {
    const customer = await this.customerRespository.get({
      id: customerId,
    })

    if (!customer) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Customer not found' }),
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(customer),
    }
  }

  async list(): Promise<APIGatewayProxyStructuredResultV2> {
    const customers = await this.customerRespository.scan()

    return {
      statusCode: 200,
      body: JSON.stringify(customers),
    }
  }

  async delete(customerId: string): Promise<APIGatewayProxyStructuredResultV2> {
    const customer = await this.customerRespository.get({
      id: customerId,
    })

    if (!customer) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Customer not found' }),
      }
    }

    await this.customerRespository.delete({
      id: customerId,
    })

    return {
      statusCode: 204,
    }
  }
}
