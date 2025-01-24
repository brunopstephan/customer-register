import { APIGatewayProxyEvent } from 'aws-lambda'
import { CustomerRepository } from './repositories'
import { dynamoClient } from './providers'
import { CustomersService } from './services'

export const handler = async (event: APIGatewayProxyEvent) => {
  if (event.path.split('/')[1] !== 'customers') {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Not Found' }),
    }
  }

  const customerRepository = new CustomerRepository(dynamoClient)
  const customersService = new CustomersService(customerRepository)

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
      return await customersService.createContact(
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

      return await customersService.updateContact(customerId, contactId, body)
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

      return await customersService.deleteContact(customerId, contactId)
    }

    return await customersService.delete(customerId)
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'Bad Request' }),
  }
}
