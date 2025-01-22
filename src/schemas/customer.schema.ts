export type Contact = {
  email: string
  phone: string
  main: boolean
}

export type Customer = {
  customerId: string
  fullName: string
  birthDate: string
  active: boolean
  addresses: string[]
  contacts: Contact[]
}
