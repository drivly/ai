'use server'

import resend from '@/lib/resend'

export const addContact = async (email: string, firstName: string, lastName: string) => {
  // Check if contact already exists before adding
  const exists = await contactExists(email)
  if (exists) {
    console.log(`Contact ${email} already exists, skipping creation`)
    return
  }

  await resend.contacts.create({
    email,
    firstName,
    lastName,
    unsubscribed: false,
    audienceId: process.env.AUDIENCE_ID as string,
  })
}

export const listContacts = async () => {
  const contacts = await resend.contacts.list({
    audienceId: process.env.AUDIENCE_ID as string,
  })
  return contacts
}

// Check if a contact with the given email already exists
export const contactExists = async (email: string): Promise<boolean> => {
  const response = await listContacts()

  // If we don't have data or the data object is null, return false
  if (!response.data || !response.data.data) {
    return false
  }

  const normalizedEmail = email.toLowerCase()
  // Since we now have proper typing, we can use the array methods
  return response.data.data.some((contact) => contact.email.toLowerCase() === normalizedEmail)
}
