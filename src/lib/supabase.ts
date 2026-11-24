import { createClient } from '@supabase/supabase-js';

// These are public browser credentials. Never place a service_role or secret key here.
const supabaseUrl = 'https://mwnvsquprizeolucggod.supabase.co';
const supabasePublishableKey = 'sb_publishable_R0uFamr_nC6XkcQ7gnRhDw_564yMB-C';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
