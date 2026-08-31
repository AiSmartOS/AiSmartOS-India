window.AISMART_CONFIG = {
  SUPABASE_URL: "https://mxkzwbgtvaccfwlaovhr.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14a3p3Ymd0dmFjY2Z3bGFvdmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzAzMDAsImV4cCI6MjA1NjgwNjMwMH0.E-Np1VjKI7aTQHswNF0escwyDxH6TmVbkeNByvO9694",
  PROFILE_TABLE: "profiles",
  AVATAR_BUCKET: "avatars"
};

if (typeof supabase !== "undefined" && supabase.createClient) {
  const _supabase = supabase.createClient(
    window.AISMART_CONFIG.SUPABASE_URL,
    window.AISMART_CONFIG.SUPABASE_ANON_KEY
  );

  window.supabase = _supabase;
  window.supabaseClient = _supabase;
  window.aiSmartOSSupabase = _supabase;
}
