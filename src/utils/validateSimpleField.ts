import { Customer, SimpleFieldValidatorOptions } from '@/schemas'

export const validateSimpleField = (
  field: Partial<Omit<Customer, 'addresses' | 'contacts'>>,
  type: string,
  options?: SimpleFieldValidatorOptions,
) => {
  const { isBasicDataUpdate } = options || {}

  const [key, value] = Object.entries(field)[0]
  const isFieldPresent = value !== undefined
  // eslint-disable-next-line valid-typeof
  const isFieldCorrectType = typeof value === type

  if (!isFieldPresent && !isBasicDataUpdate) {
    return {
      error: `${key} is required`,
    }
  }

  if (!isFieldCorrectType && isFieldPresent) {
    return {
      error: `${key} must be of type ${type}`,
    }
  }

  return {
    error: null,
  }
}
