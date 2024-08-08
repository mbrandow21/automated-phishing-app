import { getUserCompanyRole } from "@/data/company";
import { getAllCompanyContacts } from "@/data/contacts";
import { currentUser } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {

  const searchParams = req.nextUrl.searchParams

  const companyId = searchParams.get("companyId")
  const user = await currentUser()
  const userId = user.id

  if (companyId) {
    const role = await getUserCompanyRole(companyId, userId);

    if (role) {
      const companyContacts = await getAllCompanyContacts(companyId, userId)


      if (companyContacts) {
        return NextResponse.json({ contactData: companyContacts, userRoll: role }, { status: 200 })
      }
    }
  
    return new NextResponse(null, { status: 403 });

  } else {
    return new NextResponse(null, { status: 403 });
  }
}