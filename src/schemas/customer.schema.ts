export type Contact = {
    email: string,
    phone: string
    main: boolean
}

export type Customer = {
    fullName: string,
    birthDate: string,
    active: boolean,
    addresses: string[],
    contacts: Contact[]
}