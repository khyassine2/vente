import type { Database } from '@/libs/supabase/types';
import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { Env } from '@/libs/Env';

/**
 * Service-role client — bypasses Row Level Security entirely. Import this
 * only from Server Actions, Route Handlers, or React Server Components that
 * perform admin writes. Never import from a Client Component.
 */
export const supabaseAdmin = createClient<Database>(
  Env.NEXT_PUBLIC_SUPABASE_URL,
  Env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);
