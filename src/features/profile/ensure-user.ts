import { prisma } from "@/lib/db/prisma";

type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: {
    display_name?: string;
  };
};

export async function ensureUserProfile(authUser: AuthUser) {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: authUser.id,
    },
  });

  if (existingUser) {
    return existingUser;
  }

  return prisma.user.create({
    data: {
      id: authUser.id,
      displayName:
        authUser.user_metadata?.display_name ??
        authUser.email?.split("@")[0] ??
        "User",
    },
  });
}