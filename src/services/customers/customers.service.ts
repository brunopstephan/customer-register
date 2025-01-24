import { CustomerContract } from '@/repositories'
import { Address, Contact, Customer } from '@/schemas'
import { bodyParser } from '@/utils'
import { validateAddresses } from '@/utils/validateAddresses'
import { validateContacts } from '@/utils/validateContacts'
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

  async createContact(customerId: string, body: Contact) {
    const { error } = validateContacts([body], { ignoreMain: true })

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

    const { email, main, phone } = body

    const contact = { email, main, phone, id: randomUUID() } as Contact

    if (contact.main) {
      customer.contacts = customer.contacts.map((contact) => ({
        ...contact,
        main: false,
      }))
    }

    const updated = await this.customerRespository.update({
      id: customerId,
      data: {
        contacts: [...customer.contacts, contact],
      },
    })

    return {
      statusCode: 201,
      body: JSON.stringify(updated),
    }
  }

  async updateContact(customerId: string, contactId: string, body: Contact) {
    const { error } = validateContacts([body], { ignoreMain: true })

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

    const contact = customer.contacts.find(
      (contact) => contact.id === contactId,
    )

    if (!contact) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Contact not found' }),
      }
    }

    if (body.main) {
      customer.contacts.forEach((contact) => {
        contact.main = false
      })
    }

    const { email, main, phone } = body

    const updatedContacts = customer.contacts.map((contact) =>
      contact.id === contactId ? { ...contact, email, main, phone } : contact,
    )

    if (updatedContacts.every((contact) => !contact.main))
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'At least one contact must be main',
        }),
      }

    const updated = await this.customerRespository.update({
      id: customerId,
      data: {
        contacts: updatedContacts,
      },
    })

    return {
      statusCode: 200,
      body: JSON.stringify(updated),
    }
  }

  async deleteContact(customerId: string, contactId: string) {
    const customer = await this.customerRespository.get({
      id: customerId,
    })

    if (!customer) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Customer not found' }),
      }
    }

    const contact = customer.contacts.find(
      (contact) => contact.id === contactId,
    )

    if (!contact) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Contact not found' }),
      }
    }

    if (contact.main)
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Main contact cannot be deleted',
        }),
      }

    const updatedContacts = customer.contacts.filter(
      (contact) => contact.id !== contactId,
    )

    const updated = await this.customerRespository.update({
      id: customerId,
      data: {
        contacts: updatedContacts,
      },
    })

    return {
      statusCode: 204,
      body: JSON.stringify(updated),
    }
  }

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
