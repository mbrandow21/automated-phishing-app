"use server"

import { db } from "@/lib/db"

export const deleteContact = async (id: string) => {
  try {
    await db.contact.delete({
      where: { id },
    });

    return { success: "Contact Deleted Successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete contact");
  }
}
