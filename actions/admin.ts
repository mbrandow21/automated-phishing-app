"use server";

import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const admin = async () => {
  // const role = await currentRole();
  const role = "ADMIN";

  if (role !== UserRole.ADMIN) {
    return { error: "Forbidden" };
  }

  return { success: "Allowed" };
};
