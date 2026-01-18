import { account } from "@/lib/appwrite"; // admin appwrite client

export const getCurrentAdminToken = async () => {
  const session = await account.getSession("current");

  if (!session) {
    throw new Error("Admin not authenticated");
  }

  return session.providerAccessToken ?? session.$id;
};
