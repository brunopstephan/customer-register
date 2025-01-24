import { Address, Customer } from '@/schemas'
import { CustomerAddressesService } from '..'
import { MockCustomersRepository } from './mock'

describe('Customer Addresses', () => {
  let customersAddressesService: CustomerAddressesService
  let repositoryMock: MockCustomersRepository

  beforeEach(() => {
    repositoryMock = new MockCustomersRepository()
    customersAddressesService = new CustomerAddressesService(repositoryMock)
  })

  const address = {
    line: 'test',
  } as Address

  it('should create a customer address', async () => {
    jest.spyOn(repositoryMock, 'update')
    const { body, statusCode } = await customersAddressesService.createAddress(
      '1',
      address,
    )

    const { addresses } = JSON.parse(body) as Customer

    expect(repositoryMock.update).toHaveBeenCalled()
    expect(addresses.length).toBe(3)
    expect(statusCode).toBe(201)
  })

  it('should update a customer address', async () => {
    jest.spyOn(repositoryMock, 'update')
    const { body, statusCode } = await customersAddressesService.updateAddress(
      '1',
      '1',
      address,
    )

    const { addresses } = JSON.parse(body) as Customer

    expect(repositoryMock.update).toHaveBeenCalled()
    expect(addresses.length).toBe(2)
    expect(statusCode).toBe(200)
  })

  it('should throw a 400 if try to insert a address with invalid data', async () => {
    const data = await customersAddressesService.createAddress('1', {
      email: 1,
      main: true,
      phone: '19 9999999999',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    expect(data.statusCode).toBe(400)
  })

  it('should throw a 400 if try to update a address with invalid data', async () => {
    const data = await customersAddressesService.updateAddress('1', '1', {
      line: 1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    expect(data.statusCode).toBe(400)
  })

  it('should delete a customer address', async () => {
    jest.spyOn(repositoryMock, 'update')
    const { body, statusCode } = await customersAddressesService.deleteAddress(
      '1',
      '2',
    )

    const { addresses } = JSON.parse(body) as Customer

    expect(repositoryMock.update).toHaveBeenCalled()
    expect(addresses.length).toBe(1)
    expect(statusCode).toBe(204)
  })

  it('should throw a 404 error when customer not found', async () => {
    const { statusCode: createStatusCode } =
      await customersAddressesService.createAddress('2', address)

    const { statusCode: deleteStatusCode } =
      await customersAddressesService.deleteAddress('2', '')
    const { statusCode: updateStatusCode } =
      await customersAddressesService.updateAddress('2', '', address)

    expect(createStatusCode).toBe(404)
    expect(deleteStatusCode).toBe(404)
    expect(updateStatusCode).toBe(404)
  })

  it('should throw a 404 error when address not found', async () => {
    const { statusCode: deleteStatusCode } =
      await customersAddressesService.deleteAddress('1', '3')
    const { statusCode: updateStatusCode } =
      await customersAddressesService.updateAddress('1', '3', address)

    expect(deleteStatusCode).toBe(404)
    expect(updateStatusCode).toBe(404)
  })
})
