export type Contact = {
  id: string
  email: string
  phone: string
  main: boolean
}

export type Address = {
  id: string
  line: string
}

export type Customer = {
  customerId: string
  fullName: string
  birthdate: string
  active: boolean
  addresses: Address[]
  contacts: Contact[]
}
