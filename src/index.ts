import { APIGatewayProxyEvent } from 'aws-lambda'
import { CustomerRepository } from './repositories'
import { dynamoClient } from './providers'
import { bodyParser } from './utils'
import { Customer } from './schemas'
import { CustomersService } from './services'

export const handler = async (event: APIGatewayProxyEvent) => {
  const customerRepository = new CustomerRepository(dynamoClient)
  const customersService = new CustomersService(customerRepository)

  if (event.httpMethod === 'GET') {
    const customerId = event.pathParameters?.customerId

    if (!customerId) {
      const customers = await customersService.list()

      return {
        statusCode: 200,
        body: JSON.stringify(customers),
      }
    }

    const customer = await customersService.get(customerId)

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

  if (event.httpMethod === 'POST') {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Body must not be empty' }),
      }
    }

    const body = JSON.parse(event.body)

    const { errors, success } = bodyParser(body)

    if (!success) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Validation Error',
          errors,
        }),
      }
    }

    const created = await customersService.create(body as Customer)

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Created!',
        data: created,
      }),
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'Bad Request' }),
  }
}
