import { db } from "@/lib/db";
import { $Enums, UserRole } from "@prisma/client";

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
}

export const getAllCompaniesByUserId = async (userId: string): Promise<Company[] | null> => {
  try {
    const companies = await db.company.findMany({
      select: {
        id: true,
        companyName: true
      },
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

export const getUserCompanyRole = async (companyId: string, userId: string): Promise<"OWNER" | "USER" | "ADMIN" | undefined> => {

  try {
    const userCompanyRole = await db.companyUser.findFirst({
      select: {
        userCompanyRole: true,
      },
      where: {
        userId, companyId
      }
    })
    if (userCompanyRole) {
      return userCompanyRole.userCompanyRole
    }
  } catch (error) {
    console.error("ERROR", error)
    return undefined
  }
}

interface PermissiveCompanyUsers {
  user: {
    name: string | null;
    
  };
  company: {
      companyName: string;
      adminInviteToken: string | undefined;
      userInviteToken: string | undefined;
  };
  userCompanyRole: $Enums.UserRole;
}[]

interface CompanyUsers {
  user: {
    name: string;
    email: string
  };
  company: {
      companyName: string;
  };
  userCompanyRole: $Enums.UserRole;
  id: string;
}[]

export const getAllCompanyUsers = async (companyId: string, userRole: UserRole): Promise<PermissiveCompanyUsers[] | CompanyUsers[] | undefined> => {
  try {
    if (userRole === "ADMIN" || userRole === "OWNER") {
      const permissiveCompanyUsers = await db.companyUser.findMany({
        select: {
          user: {
            select: {
              name: true,
              email: true
            },
          },
          company: {
            select: {
              companyName: true,
              adminInviteToken: true,
              userInviteToken: true
            },
          },
          userCompanyRole: true,
          id: true
          
        },
        where: {
          companyId
        }
      })
      return permissiveCompanyUsers
    }
    return undefined
  } catch (error) {
    console.error(error)
    return undefined
  }
}