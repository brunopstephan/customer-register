import { CustomerContract } from '@/repositories'
import { Contact } from '@/schemas'
import { validateContacts } from '@/utils'

import { randomUUID } from 'crypto'

export class CustomerContactsService {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly customerRespository: CustomerContract) {}

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
}
