'use server';

import { cookies } from 'next/headers';
import { Env } from '@/libs/Env';

const SESSION_COOKIE = 'fl-admin-session';

/**
 * Client-side gate only — the cookie is an unsigned flag, not a real session
 * token. It keeps casual visitors out of /admin, nothing more. Real
 * protection needs Supabase Auth, which is out of scope for now.
 */
export const signInAdmin = async (password: string) => {
  if (password !== Env.ADMIN_PASSWORD) {
    return false;
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return true; 
}; 

export const signOutAdmin = async () => {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
};

export const isAdminAuthenticated = async () => {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value === '1';
};
