import { redirect } from 'next/navigation';
import { isAdminAuthenticated, signOutAdmin } from '@/admin/session';

const NAV_LINKS = [
  { to: '/admin/produits', label: 'Produits' },
];

export default async function AdminProduitsLayout(props: { children: React.ReactNode }) {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin');
  }

  const onSignOut = async () => {
    'use server';
    await signOutAdmin();
    redirect('/admin');
  };

  return (
    <div className="min-h-svh bg-paper">
      <header className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-8">
        <div className="flex items-center gap-8">
          <p className="label-micro text-ink">Fil & Ligne — Admin</p>
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <a key={link.to} href={link.to} className="label-micro block px-3 py-2 text-ink">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <form action={onSignOut}>
          <button type="submit" className="label-micro text-sage hover:text-ink">
            Déconnexion
          </button>
        </form>
      </header>

      <main className="px-4 py-8 sm:px-8">
        {props.children}
      </main>
    </div>
  );
}
