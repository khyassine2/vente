import type { Database } from '@/libs/supabase/types';
import { createClient } from '@supabase/supabase-js';
import { Env } from '@/libs/Env';

/**
 * Anon-key client for storefront reads. Safe to import from Server Components
 * — RLS restricts it to public SELECT on the catalogue tables.
 */
export const supabasePublic = createClient<Database>(
  Env.NEXT_PUBLIC_SUPABASE_URL,
  Env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);
