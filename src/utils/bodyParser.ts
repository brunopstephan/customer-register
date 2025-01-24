import { Customer } from '@/schemas'
import { validateAddresses } from './validateAddresses'
import { validateContacts } from './validateContacts'
import { validateSimpleField } from './validateSimpleField'

export function bodyParser(body: Customer, isBasicDataUpdate = false) {
  const options = { isBasicDataUpdate }

  const active = validateSimpleField(
    { active: body.active },
    'boolean',
    options,
  )

  const fullName = validateSimpleField(
    { fullName: body.fullName },
    'string',
    options,
  )

  const birthdate = validateSimpleField(
    { birthdate: body.birthdate },
    'string',
    options,
  )

  const contacts = validateContacts(body.contacts, options)

  const addresses = validateAddresses(body.addresses, options)

  const validations = [active, fullName, birthdate, contacts, addresses]

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
    data: {
      fullName: body.fullName,
      active: body.active,
      birthdate: body.birthdate,
      contacts: body.contacts,
      addresses: body.addresses,
    },
  }
}
