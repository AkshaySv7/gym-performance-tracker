//2. First create the authentication helper

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  return dbUser;
}