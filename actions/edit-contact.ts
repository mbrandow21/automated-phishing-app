"use server"

import * as z from "zod"
import { ContactSchema } from "@/schemas"
import { db } from "@/lib/db"

export const editContact = async (
  id: string,
  values: z.infer<typeof ContactSchema>
) => {
  const validatedFields = ContactSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Invalid contact data");
  }

  const { firstName, lastName, email, position } = values;

  await db.contact.update({
    where: { id },
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      position: position,
    }
  });

  return { success: "Contact Updated Successfully" };
}
