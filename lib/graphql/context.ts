import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';
import { prisma } from '../prisma';

export type GraphQLContext = {
  userId?: string;
  role?: 'USER' | 'ADMIN';
  sessionEmail?: string;
};

export async function buildContext(_req?: Request): Promise<GraphQLContext> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return {};
  return {
    userId: (session.user as { id?: string }).id,
    role: (session.user as { role?: 'USER' | 'ADMIN' }).role,
    sessionEmail: session.user.email
  };
}

export { prisma };
