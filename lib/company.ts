import { auth } from "@/auth";

export const defaultCompany = async () => {
  const session = await auth();

  return session?.user.companyUser;
}
