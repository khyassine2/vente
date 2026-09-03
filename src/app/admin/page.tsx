import { redirect } from 'next/navigation';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { isAdminAuthenticated } from '@/admin/session';

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect('/admin/produits');
  }

  return <AdminLoginForm />;
}
