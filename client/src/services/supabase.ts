import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vasuxemwjunbtccfppmg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_bsAR8dUrV4W-9Re_VsQkxQ_44pQC-Yt';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
