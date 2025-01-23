import { Customer } from '@/schemas'

const validateSimpleField = (
  field: Partial<Omit<Customer, 'addresses' | 'contacts'>>,
  type: string,
) => {
  const [key, value] = Object.entries(field)[0]
  const isFieldPresent = value !== undefined
  // eslint-disable-next-line valid-typeof
  const isFieldCorrectType = typeof value === type

  if (!isFieldPresent) {
    return {
      error: `${key} is required`,
    }
  }

  if (!isFieldCorrectType) {
    return {
      error: `${key} must be of type ${type}`,
    }
  }

  return {
    error: null,
  }
}

const validateContacts = (contacts: Customer['contacts']) => {
  const isContactsPresent = contacts !== undefined
  const isContactsArray = Array.isArray(contacts)
  const isContactsNotEmpty = contacts?.length > 0
  const isMainContactPresent = contacts?.some(
    (contact) => contact.main === true,
  )
  const isContactsCorrectType = contacts?.every(
    (contact) =>
      typeof contact.email === 'string' &&
      typeof contact.phone === 'string' &&
      typeof contact.main === 'boolean',
  )

  if (!isContactsPresent) {
    return {
      error: 'contacts is required',
    }
  }

  if (!isContactsArray) {
    return {
      error: 'contacts must be an array',
    }
  }

  if (!isContactsNotEmpty) {
    return {
      error: 'contacts must not be empty',
    }
  }

  if (!isMainContactPresent) {
    return {
      error: 'contacts must have a main contact',
    }
  }

  if (!isContactsCorrectType) {
    return {
      error: 'contacts must have email, phone and main fields',
    }
  }

  return {
    error: null,
  }
}

const validateAddresses = (addresses: Customer['addresses']) => {
  const isAddressPresent = addresses !== undefined
  const isAddressArray = Array.isArray(addresses)
  const isAddressNotEmpty = addresses?.length > 0
  const isAddressCorrectType = addresses?.every(
    (address) => typeof address === 'string',
  )

  if (!isAddressPresent) {
    return {
      error: 'addresses is required',
    }
  }

  if (!isAddressArray) {
    return {
      error: 'addresses must be an array',
    }
  }

  if (!isAddressNotEmpty) {
    return {
      error: 'addresses must not be empty',
    }
  }

  if (!isAddressCorrectType) {
    return {
      error: 'addresses must be an array of strings',
    }
  }

  return {
    error: null,
  }
}

export function bodyParser(body: Customer) {
  const active = validateSimpleField({ active: body.active }, 'boolean')

  const fullname = validateSimpleField({ fullName: body.fullName }, 'string')

  const birthDate = validateSimpleField({ birthDate: body.birthDate }, 'string')

  const contacts = validateContacts(body.contacts)

  const addresses = validateAddresses(body.addresses)

  const validations = [active, fullname, birthDate, contacts, addresses]

  const withErrors = validations.filter((validation) => validation.error)

  if (withErrors?.length > 0) {
    return {
      success: false,
      errors: withErrors,
    }
  }

  return {
    success: true,
    errors: [],
  }
}
