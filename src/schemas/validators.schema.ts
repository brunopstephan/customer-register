export type BaseValidatorOptions = {
  isBasicDataUpdate?: boolean
}

export type ContactsValidatorOptions = BaseValidatorOptions & {
  ignoreMain?: boolean
}

export type AddressesValidatorOptions = BaseValidatorOptions

export type SimpleFieldValidatorOptions = BaseValidatorOptions
