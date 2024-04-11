import { getUserCompanyRole } from "@/data/company";
import { currentUser } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {

  const searchParams = req.nextUrl.searchParams

  const companyId = searchParams.get("companyId")
  const user = await currentUser()
  const userId = user.id

  if (companyId) {
    const role = await getUserCompanyRole(companyId, userId);

    return NextResponse.json({ role }, { status: 200 })
  } 
  else new NextResponse(null, {status: 403})
}