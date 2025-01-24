import { CustomerContract } from '@/repositories'
import { Address } from '@/schemas'
import { validateAddresses } from '@/utils'

import { randomUUID } from 'crypto'

export class CustomerAddressesService {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly customerRespository: CustomerContract) {}

  async createAddress(customerId: string, body: Address) {
    const { error } = validateAddresses([body])

    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Validation Error',
          errors: [error],
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

    const { line } = body

    const address = { line, id: randomUUID() }

    const updated = await this.customerRespository.update({
      id: customerId,
      data: {
        addresses: [...customer.addresses, address],
      },
    })

    return {
      statusCode: 201,
      body: JSON.stringify(updated),
    }
  }

  async updateAddress(customerId: string, addressId: string, body: Address) {
    const { error } = validateAddresses([body])

    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Validation Error',
          errors: [error],
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

    const address = customer.addresses.find(
      (address) => address.id === addressId,
    )

    if (!address) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Address not found' }),
      }
    }

    const { line } = body

    const updatedAddresses = customer.addresses.map((address) =>
      address.id === addressId ? { ...address, line } : address,
    )

    const updated = await this.customerRespository.update({
      id: customerId,
      data: {
        addresses: updatedAddresses,
      },
    })

    return {
      statusCode: 200,
      body: JSON.stringify(updated),
    }
  }

  async deleteAddress(customerId: string, addressId: string) {
    const customer = await this.customerRespository.get({
      id: customerId,
    })

    if (!customer) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Customer not found' }),
      }
    }

    const address = customer.addresses.find(
      (address) => address.id === addressId,
    )

    if (!address) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Address not found' }),
      }
    }

    const updatedAddresses = customer.addresses.filter(
      (address) => address.id !== addressId,
    )

    const updated = await this.customerRespository.update({
      id: customerId,
      data: {
        addresses: updatedAddresses,
      },
    })

    return {
      statusCode: 204,
      body: JSON.stringify(updated),
    }
  }
}
