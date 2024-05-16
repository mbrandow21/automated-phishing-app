import { db } from "@/lib/db";

import { useCurrentUser } from "@/hooks/use-current-user"
import { getAllCompaniesByUserId } from "./company"


interface CompanyContacts {
        id: string
        companyId: string
        firstName: string | null
        lastName: string | null
        email: string
        position: string | null
        lastAuditDate: Date | null
        auditScore: number | null
    }[]


export const getAllCompanyContacts = async (companyId: string, userId: string): Promise<CompanyContacts[] | undefined> => {

    try {

      if (companyId) {

        const checkCompanyId = await db.companyUser.findFirst({
            where: {
                companyId,
                userId
            }
        })

        if(checkCompanyId) {
            const contacts = await db.contact.findMany({
                where: {
                    companyId
                }
            })
            return contacts
        }
      }
      return undefined
    } catch (error) {
      console.error(error)
      return undefined
    }
  }