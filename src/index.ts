import { APIGatewayProxyEvent } from 'aws-lambda'
import { CustomerRepository } from './repositories'
import { dynamoClient } from './providers'
import {
  CustomerAddressesService,
  CustomerContactsService,
  CustomersService,
} from './services'

export const handler = async (event: APIGatewayProxyEvent) => {
  if (event.path.split('/')[1] !== 'customers') {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Not Found' }),
    }
  }

  const customerRepository = new CustomerRepository(dynamoClient)
  const customersService = new CustomersService(customerRepository)
  const customerContactsService = new CustomerContactsService(
    customerRepository,
  )
  const customerAddressesService = new CustomerAddressesService(
    customerRepository,
  )

  if (event.httpMethod === 'GET') {
    const customerId = event.pathParameters?.customerId

    if (!customerId) {
      return await customersService.list()
    }

    return await customersService.get(customerId)
  }

  if (event.httpMethod === 'POST') {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Body must not be empty' }),
      }
    }
    const body = JSON.parse(event.body)

    if (event.pathParameters?.customerId && event.path.includes('contacts')) {
      return await customerContactsService.createContact(
        event.pathParameters?.customerId,
        body,
      )
    }

    if (event.pathParameters?.customerId && event.path.includes('addresses')) {
      return await customerAddressesService.createAddress(
        event.pathParameters?.customerId,
        body,
      )
    }

    return await customersService.create(body)
  }

  if (event.httpMethod === 'PUT') {
    const customerId = event.pathParameters?.customerId

    if (!customerId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'customerId not provided' }),
      }
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Body must not be empty' }),
      }
    }

    const body = JSON.parse(event.body)

    if (event.path.includes('contacts')) {
      const contactId = event.pathParameters?.contactId

      if (!contactId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'contactId not provided' }),
        }
      }

      return await customerContactsService.updateContact(
        customerId,
        contactId,
        body,
      )
    }

    if (event.path.includes('addresses')) {
      const addressId = event.pathParameters?.addressId

      if (!addressId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'addressId not provided' }),
        }
      }

      return await customerAddressesService.updateAddress(
        customerId,
        addressId,
        body,
      )
    }

    return await customersService.updateBasicData(customerId, body)
  }

  if (event.httpMethod === 'DELETE') {
    const customerId = event.pathParameters?.customerId

    if (!customerId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'customerId not provided' }),
      }
    }

    if (event.path.includes('contacts')) {
      const contactId = event.pathParameters?.contactId

      if (!contactId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'contactId not provided' }),
        }
      }

      return await customerContactsService.deleteContact(customerId, contactId)
    }

    if (event.path.includes('addresses')) {
      const addressId = event.pathParameters?.addressId

      if (!addressId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'addressId not provided' }),
        }
      }

      return await customerAddressesService.deleteAddress(customerId, addressId)
    }

    return await customersService.delete(customerId)
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'Bad Request' }),
  }
}
