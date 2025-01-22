import { APIGatewayProxyEvent } from 'aws-lambda'

export const handler = async (event: APIGatewayProxyEvent) => {
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Hello World!' }),
    }
  }

  if (event.httpMethod === 'POST') {
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Created!' }),
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'Bad Request' }),
  }
}
