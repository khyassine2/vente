'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signInAdmin } from '@/admin/session';
import { Button } from '@/components/Button';

export const AdminLoginForm = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);

    const ok = await signInAdmin(password);

    if (!ok) {
      setError(true);
      setPending(false);
      return;
    }

    router.push('/admin/produits');
  };

  return (
    <div className="grid min-h-svh place-items-center bg-paper px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <p className="label-micro text-ink">Fil & Ligne — Admin</p>
        <h1 className="mt-3 text-section">Connexion</h1>

        <label htmlFor="password" className="mt-8 block">
          <span className="label-micro text-sage">Mot de passe</span>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError(false);
            }}
            className="mt-3 min-h-6 w-full border border-line bg-transparent px-4 py-3 text-sm focus:border-forest focus:outline-none"
          />
        </label>

        <p aria-live="polite" className="mt-2 h-4 text-[0.8125rem] text-terracotta">
          {error ? 'Mot de passe incorrect.' : ''}
        </p>

        <Button type="submit" full className="mt-6" disabled={pending}>
          Se connecter
        </Button>
      </form>
    </div>
  );
};
