import { Customer } from '@/schemas'
import { CustomersService } from '..'
import { MockCustomersRepository } from './mock'

describe('Customers', () => {
  let customersService: CustomersService
  let repositoryMock: MockCustomersRepository

  beforeEach(() => {
    repositoryMock = new MockCustomersRepository()
    customersService = new CustomersService(repositoryMock)
  })

  const customer = {
    customerId: '1',
    active: true,
    addresses: [
      {
        line: 'test',
      },
    ],
    birthdate: '2020-01-01',
    contacts: [
      {
        email: 'test@test.com',
        main: true,
        phone: '19 9999999999',
      },
    ],
    fullName: 'Test Da Silva',
  } as Customer

  it('should create a customer', async () => {
    jest.spyOn(repositoryMock, 'create')
    const data = await customersService.create(customer)

    expect(repositoryMock.create).toHaveBeenCalled()
    expect(data.statusCode).toBe(201)
  })

  it('should update a customer', async () => {
    jest.spyOn(repositoryMock, 'update')
    const data = await customersService.updateBasicData('1', customer)

    expect(repositoryMock.update).toHaveBeenCalled()
    expect(data.statusCode).toBe(200)
  })

  it('should get a customer', async () => {
    const { body, statusCode } = await customersService.get('1')

    const customer = JSON.parse(body) as Customer

    expect(customer.customerId).toBe('1')
    expect(statusCode).toBe(200)
  })

  it('should throw a 400 if try to insert a customer with invalid data', async () => {
    const data = await customersService.create({
      ...customer,
      birthdate: 1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    expect(data.statusCode).toBe(400)
  })

  it('should throw a 400 if try to update a customer with invalid data', async () => {
    const data = await customersService.updateBasicData('1', {
      ...customer,
      birthdate: 1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    expect(data.statusCode).toBe(400)
  })

  it('should delete a customer', async () => {
    jest.spyOn(repositoryMock, 'delete')
    const { statusCode } = await customersService.delete('1')

    expect(repositoryMock.delete).toHaveBeenCalled()
    expect(statusCode).toBe(204)
  })

  it('should throw a 404 if customer dont exists', async () => {
    const deleteData = await customersService.delete('2')
    const getData = await customersService.get('2')
    const update = await customersService.updateBasicData('2', customer)

    expect(deleteData.statusCode).toBe(404)
    expect(getData.statusCode).toBe(404)
    expect(update.statusCode).toBe(404)
  })
})
