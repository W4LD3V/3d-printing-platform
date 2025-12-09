import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import OrdersClient from './orders-client';

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const role = (session.user as { role?: string } | undefined)?.role;
  if (role === 'ADMIN') redirect('/admin');

  return <OrdersClient />;
}
