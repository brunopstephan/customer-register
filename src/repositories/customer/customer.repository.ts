import { Customer } from '@/schemas'
import { CustomerContract } from './customer.contract'
import { CustomerEntity } from './customer.entity'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { TABLE_NAME } from '@/constants'

export class CustomerRepository implements CustomerContract {
  private readonly dbClient: DynamoDB

  constructor(client: DynamoDB) {
    this.dbClient = client
  }

  async get(params: CustomerEntity['get']): Promise<Customer | null> {
    return this.dbClient
      .getItem({
        TableName: TABLE_NAME,
        Key: marshall({ customerId: params.id }),
      })
      .then(({ Item }) => unmarshall(Item) as Customer)
      .catch(() => null)
  }

  async create(params: CustomerEntity['create']): Promise<Customer> {
    return this.dbClient
      .putItem({
        TableName: TABLE_NAME,
        Item: marshall(params.data),
      })
      .then(() => params.data)
  }

  async update({ data, id }: CustomerEntity['update']): Promise<Customer> {
    const keys = Object.keys(data)

    return this.dbClient
      .updateItem({
        TableName: TABLE_NAME,
        Key: marshall({ customerId: id }),
        UpdateExpression: `SET ${keys.map((key) => `#${key} = :${key}`).join(', ')}`,
        ExpressionAttributeNames: keys.reduce((acc, key) => {
          acc[`#${key}`] = key
          return acc
        }, {}),
        ExpressionAttributeValues: marshall(
          Object.fromEntries(keys.map((key) => [`:${key}`, data[key]])),
        ),
        ReturnValues: 'ALL_NEW',
      })
      .then((data) => unmarshall(data.Attributes) as Customer)
  }

  delete(params: CustomerEntity['delete']): void {
    this.dbClient.deleteItem({
      TableName: TABLE_NAME,
      Key: marshall({ customerId: params.id }),
    })
  }

  async scan(): Promise<Customer[]> {
    return this.dbClient
      .scan({
        TableName: TABLE_NAME,
      })
      .then(({ Items }) => Items.map((item) => unmarshall(item)) as Customer[])
  }
}
