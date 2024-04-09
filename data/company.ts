import { db } from "@/lib/db";

export const getFirstCompanyByUserId = async (userId: string) => {
  try {
    const company = await db.companyUser.findFirst({
      where: {
        userId,
      }
    });

    return company
  } catch {
    return null
  }
}


interface Company {
  id: string;
  companyName: string;
  adminInviteToken: string;
  userInviteToken: string;
  companyOwnerId: string;
}

export const getAllCompaniesByUserId = async (userId: string): Promise<Company[] | null> => {
  try {
    const companies = await db.company.findMany({
      where: {
        companyUsers: {
          some: {
            userId: userId,
          },
        },
      },
    });

    return companies
  } catch (error) {
    console.log(error)
    return null
  }
}