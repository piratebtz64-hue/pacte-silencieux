import { prisma } from '@/lib/prisma';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function getAuthenticatedAppUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  return prisma.user.findUnique({
    where: { email: user.email.toLowerCase().trim() },
  });
}
