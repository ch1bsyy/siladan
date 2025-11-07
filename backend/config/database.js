import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
// Support both SUPABASE_KEY (anon) and SUPABASE_SERVICE_ROLE_KEY (server-side)
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'SUPABASE_URL and SUPABASE_KEY (or SUPABASE_SERVICE_ROLE_KEY) must be set in environment variables.\n' +
    'Create a .env file with SUPABASE_URL and SUPABASE_KEY (or SUPABASE_SERVICE_ROLE_KEY for server usage) and do not commit it.'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;