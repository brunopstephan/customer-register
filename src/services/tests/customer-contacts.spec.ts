import { Contact, Customer } from '@/schemas'
import { CustomerContactsService } from '..'
import { MockCustomersRepository } from './mock'

describe('Customer Contacts', () => {
  let customersContactsService: CustomerContactsService
  let repositoryMock: MockCustomersRepository

  beforeEach(() => {
    repositoryMock = new MockCustomersRepository()
    customersContactsService = new CustomerContactsService(repositoryMock)
  })

  const contact = {
    email: 'test@test.com',
    main: true,
    phone: '19 9999999999',
  } as Contact

  it('should create a customer contact', async () => {
    jest.spyOn(repositoryMock, 'update')
    const { body, statusCode } = await customersContactsService.createContact(
      '1',
      contact,
    )

    const { contacts } = JSON.parse(body) as Customer

    expect(repositoryMock.update).toHaveBeenCalled()
    expect(contacts.length).toBe(3)
    expect(statusCode).toBe(201)
  })

  it('should update a customer contact', async () => {
    jest.spyOn(repositoryMock, 'update')
    const { body, statusCode } = await customersContactsService.updateContact(
      '1',
      '1',
      contact,
    )

    const { contacts } = JSON.parse(body) as Customer

    expect(repositoryMock.update).toHaveBeenCalled()
    expect(contacts.length).toBe(2)
    expect(statusCode).toBe(200)
  })

  it('should throw a 400 if try to update the main contacat to false', async () => {
    const data = await customersContactsService.updateContact('1', '1', {
      email: '',
      main: false,
      phone: '',
    } as Contact)

    expect(data.statusCode).toBe(400)
  })

  it('should throw a 400 if try to insert a contact with invalid data', async () => {
    const data = await customersContactsService.createContact('1', {
      email: 1,
      main: true,
      phone: '19 9999999999',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    expect(data.statusCode).toBe(400)
  })

  it('should throw a 400 if try to update a contact with invalid data', async () => {
    const data = await customersContactsService.updateContact('1', '1', {
      email: 1,
      main: true,
      phone: '19 9999999999',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    expect(data.statusCode).toBe(400)
  })

  it('should delete a customer contact', async () => {
    jest.spyOn(repositoryMock, 'update')
    const { body, statusCode } = await customersContactsService.deleteContact(
      '1',
      '2',
    )

    const { contacts } = JSON.parse(body) as Customer

    expect(repositoryMock.update).toHaveBeenCalled()
    expect(contacts.length).toBe(1)
    expect(statusCode).toBe(204)
  })

  it('should throw a 400 if try to delete the main contact', async () => {
    const data = await customersContactsService.deleteContact('1', '1')

    expect(data.statusCode).toBe(400)
  })

  it('should throw a 404 error when customer not found', async () => {
    const { statusCode: createStatusCode } =
      await customersContactsService.createContact('2', contact)

    const { statusCode: deleteStatusCode } =
      await customersContactsService.deleteContact('2', '')
    const { statusCode: updateStatusCode } =
      await customersContactsService.updateContact('2', '', contact)

    expect(createStatusCode).toBe(404)
    expect(deleteStatusCode).toBe(404)
    expect(updateStatusCode).toBe(404)
  })

  it('should throw a 404 error when contact not found', async () => {
    const { statusCode: deleteStatusCode } =
      await customersContactsService.deleteContact('1', '3')
    const { statusCode: updateStatusCode } =
      await customersContactsService.updateContact('1', '3', contact)

    expect(deleteStatusCode).toBe(404)
    expect(updateStatusCode).toBe(404)
  })
})
