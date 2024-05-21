"use server"

import * as z from "zod"

import { ContactSchema } from "@/schemas"
import { db } from "@/lib/db"

export const createContact = async (
  values: z.infer<typeof ContactSchema>,
  companyId?: string | null
) => {
  const validatedFields = ContactSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Invalid contact data");
  }

  const { firstName, lastName, email, position } = values;

  if (!companyId) {
    throw new Error("Company ID is required");
  }

  await db.contact.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      position: position,
      company: {
        connect: {
          id: companyId
        }
      }
    }
  })

  return {success: "Contact Created Successfully"}
}