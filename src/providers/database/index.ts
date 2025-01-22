import { DynamoDB } from '@aws-sdk/client-dynamodb'

export const dynamoClient = new DynamoDB({
  endpoint: 'http://localhost:8000',
})
