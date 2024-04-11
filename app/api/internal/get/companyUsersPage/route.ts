import { getAllCompanyUsers, getUserCompanyRole } from "@/data/company";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {

  const searchParams = req.nextUrl.searchParams

  const companyId = searchParams.get("companyId")
  const user = await currentUser()
  const userId = user.id

  if (companyId) {
    const role = await getUserCompanyRole(companyId, userId);

    if (role !== "USER" && role !== null && role !== undefined) {
      const companyUsers = await getAllCompanyUsers(companyId, role)

      if (companyUsers) {
        console.log(companyUsers)
        return NextResponse.json({ companyUserData: companyUsers, userRoll: role }, { status: 200 })
      }
    }
  
    return new NextResponse(null, { status: 403 });

  } else {
    return new NextResponse(null, { status: 403 });
  }
}