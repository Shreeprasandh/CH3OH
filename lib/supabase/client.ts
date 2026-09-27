import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://puycrmchufwtwgudzwbm.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1eWNybWNodWZ3dHdndWR6d2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MDI4NTIsImV4cCI6MjEwNjA3ODg1Mn0.xhSw5B1Z3XHDqWr_IM0_kZ-L7O3FvWxlxHkA0I0XZDs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
