"use server"

import * as z from "zod";

import { CompanySetupSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { v4 as uuidv4 } from "uuid"
import { UserRole } from "@prisma/client";


export const addCompanyUser = async (values: z.infer<typeof CompanySetupSchema>) => {
  const validatedFields = CompanySetupSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Oops! Try again or check invite key" }
  }

  const { companyName, companyInviteLink } = validatedFields.data;

  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  };

  const dbUser = await getUserById(user.id);

  if (!dbUser) return { error: "Unauthorized" };

  if (!companyName && !companyInviteLink) {
    return {error: "No data was sent"}
  }

  if (companyName && companyInviteLink) {
    return {error: "Can't join and create a company simultaneously"}
  }

  if (companyName) {
    const adminInvToken = uuidv4();
    const userInvToken = uuidv4();

    const newCompany = await db.company.create({
      data: {
        companyName: companyName,
        companyOwnerId: dbUser.id,
        adminInviteToken: adminInvToken,
        userInviteToken: userInvToken,
      }
    })

    const newCompanyUser = await db.companyUser.create({
      data: {
        userId: dbUser.id,
        companyId: newCompany.id,
        userCompanyRole: UserRole.OWNER
      },
    });

    return { success: "Company created and user assigned as OWNER.", companyId: newCompanyUser.companyId }
  }

  if (companyInviteLink) {
    const token = companyInviteLink; // In reality, you might need to extract the token from a URL

    let role
    // First, try to find a company with a matching admin invite token
    let company = await db.company.findFirst({
      where: {
        adminInviteToken: token,
      },
    });

    role = UserRole.ADMIN;

    // If no company was found with the admin token, try the user invite token
    if (!company) {
       company = await db.company.findFirst({
        where: {
          userInviteToken: token,
        },
      });
      role = UserRole.USER;
    }
    
    // If still no company is found, the invite link is invalid
    if (!company) {
      return { error: "Invalid invite link." };
    }

    // At this point, a company has been found, so create the CompanyUser association
    const newCompanyUser = await db.companyUser.create({
      data: {
        userId: dbUser.id,
        companyId: company.id,
        userCompanyRole: role,
      },
    });

    return { success: `User added to company`, companyId: newCompanyUser.companyId };
  }

  return { error: "Something went wrong!" }
}