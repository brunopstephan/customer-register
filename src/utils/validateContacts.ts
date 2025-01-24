import { Contact, ContactsValidatorOptions } from '@/schemas'

export const validateContacts = (
  contacts: Contact[],
  options?: ContactsValidatorOptions,
) => {
  const { isBasicDataUpdate, ignoreMain } = options || {}
  if (isBasicDataUpdate) return { error: null }

  const isContactsPresent = contacts !== undefined
  const isContactsArray = Array.isArray(contacts)
  const isContactsNotEmpty = contacts?.length > 0
  const isMainContactPresent = contacts?.some(
    (contact) => contact.main === true,
  )
  const hasOnlyOneMainContact =
    contacts?.filter((contact) => contact.main).length === 1
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

  if (!hasOnlyOneMainContact && !ignoreMain) {
    return {
      error: 'contacts must have only one main contact',
    }
  }

  if (!isContactsNotEmpty) {
    return {
      error: 'contacts must not be empty',
    }
  }

  if (!isMainContactPresent && !ignoreMain) {
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
