import { Address, AddressesValidatorOptions } from '@/schemas'

export const validateAddresses = (
  addresses: Address[],
  options?: AddressesValidatorOptions,
) => {
  const { isBasicDataUpdate } = options || {}
  if (isBasicDataUpdate) return { error: null }

  const isAddressPresent = addresses !== undefined
  const isAddressArray = Array.isArray(addresses)
  const isAddressNotEmpty = addresses?.length > 0
  const isAddressCorrectType = addresses?.every(
    (contact) => typeof contact.line === 'string',
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
      error: 'addresses must be an array of line fields',
    }
  }

  return {
    error: null,
  }
}
